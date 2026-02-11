// src/client/domain/widgets/github.ts

import type { GithubRepoResponse } from './githubApiTypes'

/**
 * GitHub 配置
 */
export interface GithubConfig {
  /** GitHub 用户名 */
  username: string;
  /** API 基础 URL */
  apiBaseUrl: string;
  /** 请求超时时间（毫秒） */
  timeout: number;
  /** 缓存有效期（毫秒） */
  cacheExpiry: number;
}

/**
 * GitHub 仓库信息
 */
export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
}

/**
 * GitHub 统计信息
 */
export interface GithubStats {
  /** 公开仓库数量 */
  repoCount: number;
  /** 总星标数 */
  totalStars: number;
  /** 总 fork 数 */
  totalForks: number;
  /** 最后更新时间 */
  lastUpdated: string;
  /** 缓存是否有效 */
  isCached: boolean;
}

/**
 * 默认 GitHub 配置
 */
export const DEFAULT_GITHUB_CONFIG: GithubConfig = {
  username: 'LamborGitted', // 需要替换为实际的 GitHub 用户名
  apiBaseUrl: 'https://api.github.com',
  timeout: 10000,
  cacheExpiry: 5 * 60 * 1000, // 5 分钟
};

/**
 * GitHub 管理器
 */
class GithubManager {
  private config: GithubConfig = { ...DEFAULT_GITHUB_CONFIG };
  private cache: {
    data: GithubStats | null;
    timestamp: number;
  } = {
    data: null,
    timestamp: 0,
  };

  /**
   * 获取配置
   */
  getConfig(): GithubConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<GithubConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 设置 GitHub 用户名
   */
  setUsername(username: string): void {
    this.config.username = username;
  }

  /**
   * 获取缓存是否有效
   */
  private isCacheValid(): boolean {
    if (!this.cache.data) return false;
    const now = Date.now();
    return now - this.cache.timestamp < this.config.cacheExpiry;
  }

  /**
   * 从缓存获取数据
   */
  getFromCache(): GithubStats | null {
    if (this.isCacheValid()) {
      return { ...this.cache.data!, isCached: true };
    }
    return null;
  }

  /**
   * 设置缓存
   */
  private setCache(data: GithubStats): void {
    this.cache.data = data;
    this.cache.timestamp = Date.now();
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.data = null;
    this.cache.timestamp = 0;
  }

  /**
   * 获取 GitHub 公开仓库信息
   */
  async fetchRepos(): Promise<GithubRepo[]> {
    const url = `${this.config.apiBaseUrl}/users/${this.config.username}/repos?type=public&per_page=100&sort=updated`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GitHub API 请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return data.map((repo: GithubRepoResponse) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        updatedAt: repo.updated_at,
      }));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('GitHub API 请求超时');
      }
      throw error;
    }
  }

  /**
   * 获取 GitHub 统计信息
   */
  async getStats(): Promise<GithubStats> {
    // 先检查缓存
    const cached = this.getFromCache();
    if (cached) {
      return cached;
    }

    try {
      const repos = await this.fetchRepos();

      const stats: GithubStats = {
        repoCount: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stars, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks, 0),
        lastUpdated:
          repos.length > 0
            ? (() => {
                const sortedRepos = [...repos].sort(
                  (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                )
                return sortedRepos[0]?.updatedAt || new Date().toISOString()
              })()
            : new Date().toISOString(),
        isCached: false,
      };

      // 设置缓存
      this.setCache(stats);

      return stats;
    } catch (error) {
      console.error('获取 GitHub 统计信息失败:', error);
      // 返回默认值
      return {
        repoCount: 0,
        totalStars: 0,
        totalForks: 0,
        lastUpdated: new Date().toISOString(),
        isCached: false,
      };
    }
  }

  /**
   * 仅获取公开仓库数量（带缓存）
   */
  async getRepoCount(): Promise<number> {
    const stats = await this.getStats();
    return stats.repoCount;
  }
}

/**
 * 导出单例实例
 */
export const githubManager = new GithubManager();

/**
 * 设置 GitHub 用户名
 */
export function setGithubUsername(username: string): void {
  githubManager.setUsername(username);
}

/**
 * 获取 GitHub 统计信息
 */
export async function getGithubStats(): Promise<GithubStats> {
  return githubManager.getStats();
}

/**
 * 获取 GitHub 公开仓库数量
 */
export async function getGithubRepoCount(): Promise<number> {
  return githubManager.getRepoCount();
}

/**
 * 清除 GitHub 缓存
 */
export function clearGithubCache(): void {
  githubManager.clearCache();
}

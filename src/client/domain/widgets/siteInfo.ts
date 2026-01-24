// src/client/domain/widgets/siteInfo.ts

/**
 * 站点信息配置
 */
export interface SiteInfoConfig {
  /** 站点建立日期 */
  siteStartDate: string;
  /** 站点名称 */
  siteName: string;
  /** 站点描述 */
  siteDescription?: string;
}

/**
 * 默认站点信息配置
 */
export const DEFAULT_SITE_INFO: SiteInfoConfig = {
  siteStartDate: '2024-01-01',
  siteName: 'XL-Blog',
  siteDescription: 'A personal blog powered by Vue 3',
};

/**
 * 站点信息管理（单例）
 */
class SiteInfoManager {
  private config: SiteInfoConfig = { ...DEFAULT_SITE_INFO };

  /**
   * 获取站点建立日期
   */
  getSiteStartDate(): Date {
    return new Date(this.config.siteStartDate);
  }

  /**
   * 计算开站时长（毫秒）
   */
  getSiteAge(): number {
    const startDate = this.getSiteStartDate();
    const now = new Date();
    return now.getTime() - startDate.getTime();
  }

  /**
   * 获取开站天数的文本描述
   */
  getSiteAgeText(): string {
    const age = this.getSiteAge();
    const days = Math.floor(age / (1000 * 60 * 60 * 24));
    const hours = Math.floor((age % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((age % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      return `${years}年${remainingDays}天`;
    }

    if (days > 0) {
      return `${days}天${hours}小时`;
    }

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }

    return `${minutes}分钟`;
  }

  /**
   * 获取开站详细信息
   */
  getSiteAgeDetails(): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    text: string;
  } {
    const age = this.getSiteAge();
    const days = Math.floor(age / (1000 * 60 * 60 * 24));
    const hours = Math.floor((age % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((age % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((age % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      text: this.getSiteAgeText(),
    };
  }

  /**
   * 获取配置
   */
  getConfig(): SiteInfoConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<SiteInfoConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 设置站点建立日期
   */
  setSiteStartDate(date: string): void {
    this.config.siteStartDate = date;
  }
}

/**
 * 导出单例实例
 */
export const siteInfoManager = new SiteInfoManager();

/**
 * 获取开站时长
 */
export function getSiteAge(): number {
  return siteInfoManager.getSiteAge();
}

/**
 * 获取开站时长文本
 */
export function getSiteAgeText(): string {
  return siteInfoManager.getSiteAgeText();
}

/**
 * 获取开站详细信息
 */
export function getSiteAgeDetails(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  text: string;
} {
  return siteInfoManager.getSiteAgeDetails();
}

/**
 * 设置站点建立日期
 */
export function setSiteStartDate(date: string): void {
  siteInfoManager.setSiteStartDate(date);
}

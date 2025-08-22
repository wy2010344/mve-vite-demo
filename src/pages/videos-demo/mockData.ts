export interface Video {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: number; // 秒
  views: number;
  likes: number;
  uploadTime: string;
  category: string;
  quality?: string;
  verified: boolean;
}

const categories = [
  "entertainment",
  "education",
  "technology",
  "music",
  "sports",
  "gaming",
  "news",
];

const authors = [
  "科技探索者",
  "音乐达人",
  "游戏主播",
  "教育频道",
  "新闻快报",
  "体育解说",
  "娱乐八卦",
  "生活博主",
  "美食家",
  "旅行者",
  "摄影师",
  "程序员",
  "设计师",
  "创业者",
  "投资人",
  "艺术家",
];

const titleTemplates = [
  "如何在30天内掌握{}技能",
  "{}的终极指南：从入门到精通",
  "震惊！{}竟然可以这样做",
  "{}vs{}：哪个更好？",
  "2024年最新{}趋势分析",
  "{}背后的秘密你知道吗？",
  "5分钟学会{}的核心技巧",
  "{}改变了我的生活",
  "为什么{}如此重要？",
  "{}的未来发展方向",
];

const topics = [
  "React",
  "Vue",
  "JavaScript",
  "Python",
  "AI",
  "Machine Learning",
  "区块链",
  "加密货币",
  "投资理财",
  "创业",
  "设计",
  "摄影",
  "音乐制作",
  "视频剪辑",
  "游戏开发",
  "移动开发",
  "云计算",
  "数据分析",
  "产品管理",
  "市场营销",
  "健身",
  "美食",
  "旅行",
];

// 生成随机缩略图URL
const generateThumbnail = (index: number): string => {
  const colors = [
    "FF6B6B",
    "4ECDC4",
    "45B7D1",
    "FFA07A",
    "98D8C8",
    "F7DC6F",
    "BB8FCE",
  ];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/320x180/${color}/FFFFFF?text=Video+${
    index + 1
  }`;
};

// 生成随机视频标题
const generateTitle = (index: number): string => {
  const template = titleTemplates[index % titleTemplates.length];
  const topic1 = topics[Math.floor(Math.random() * topics.length)];
  const topic2 = topics[Math.floor(Math.random() * topics.length)];

  return template.replace("{}", topic1).replace("{}", topic2);
};

// 生成随机时间
const generateUploadTime = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 365);
  const uploadDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  if (daysAgo === 0) return "今天";
  if (daysAgo === 1) return "昨天";
  if (daysAgo < 7) return `${daysAgo}天前`;
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}周前`;
  if (daysAgo < 365) return `${Math.floor(daysAgo / 30)}个月前`;
  return `${Math.floor(daysAgo / 365)}年前`;
};

// 生成随机数字（带权重）
const generateViews = (): number => {
  const rand = Math.random();
  if (rand < 0.1) return Math.floor(Math.random() * 1000); // 10% 低观看量
  if (rand < 0.3) return Math.floor(Math.random() * 10000) + 1000; // 20% 中等观看量
  if (rand < 0.7) return Math.floor(Math.random() * 100000) + 10000; // 40% 高观看量
  return Math.floor(Math.random() * 1000000) + 100000; // 30% 超高观看量
};

const generateLikes = (views: number): number => {
  // 点赞数通常是观看数的 2-10%
  const ratio = 0.02 + Math.random() * 0.08;
  return Math.floor(views * ratio);
};

export const generateMockVideos = (page: number, count: number): Video[] => {
  return Array.from({ length: count }, (_, index) => {
    const views = generateViews();
    const likes = generateLikes(views);
    const duration = 30 + Math.floor(Math.random() * 1800); // 30秒到30分钟

    return {
      id: `video-${page}-${index}`,
      title: generateTitle(index),
      author: authors[Math.floor(Math.random() * authors.length)],
      thumbnail: generateThumbnail(index),
      duration,
      views,
      likes,
      uploadTime: generateUploadTime(),
      category: categories[Math.floor(Math.random() * categories.length)],
      quality:
        Math.random() > 0.7
          ? ["HD", "4K", "1080P"][Math.floor(Math.random() * 3)]
          : undefined,
      verified: Math.random() > 0.8, // 20% 的作者是认证用户
    };
  });
};

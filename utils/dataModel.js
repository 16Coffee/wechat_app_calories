// 用户信息模型
const userModel = {
  // 用户基本信息
  userInfo: {
    nickname: '',
    avatar: '',
    gender: 0, // 0-未知 1-男 2-女
    height: 0, // 单位厘米
    birthday: '',
    activityLevel: 1 // 1-久坐 2-轻度活动 3-中度活动 4-重度活动
  },
  
  // 体重信息
  weightInfo: {
    initial: 0,
    current: 0,
    target: 0,
    histories: [] // 包含{date, weight}对象的数组
  },
  
  // 腰围信息
  waistlineInfo: {
    current: 0,
    histories: [] // 包含{date, waistline}对象的数组
  }
};

// 饮食记录模型
const dietModel = {
  // 每日饮食记录
  dailyRecords: {}, // 按日期索引{date: {breakfast: [], lunch: [], dinner: [], snacks: []}}
  
  // 食物库
  foodLibrary: {
    favorites: [], // 收藏的食物
    uploaded: [] // 上传的食物
  }
};

// 运动记录模型
const exerciseModel = {
  // 每日运动记录
  dailyRecords: {}, // 按日期索引{date: [{type, duration, calories}]}
  
  // 运动库
  exerciseLibrary: {
    favorites: [] // 收藏的运动
  }
};

// 健康习惯模型
const habitModel = {
  habits: [], // 已创建的习惯列表
  dailyCompletions: {} // 按日期索引的完成情况
};

export {
  userModel,
  dietModel,
  exerciseModel,
  habitModel
}; 
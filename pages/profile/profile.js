Page({
  data: {
    userInfo: {
      nickname: '无糖友友_5bt3tj',
      avatar: '/images/default-avatar.png'
    },
    weightInfo: {
      current: 74.4,
      target: 75.0,
      bmi: 22.7
    }
  },
  
  // 用户信息
  navigateToUserInfo: function() {
    wx.navigateTo({
      url: '../user-detail/user-detail',
    })
  },
  
  // 基本信息功能
  navigateToBasicInfo: function() {
    wx.showToast({
      title: '基本信息功能正在开发中',
      icon: 'none'
    })
  },
  
  // 收藏的食物
  navigateToFavoriteFood: function() {
    wx.showToast({
      title: '收藏的食物功能正在开发中',
      icon: 'none'
    })
  },
  
  // 上传的食物
  navigateToUploadedFood: function() {
    wx.showToast({
      title: '上传的食物功能正在开发中',
      icon: 'none'
    })
  },
  
  // 薄荷故事
  navigateToStory: function() {
    wx.showToast({
      title: '无糖故事功能正在开发中',
      icon: 'none'
    })
  },
  
  navigateToHealthAssessment: function() {
    wx.navigateTo({
      url: '../health-assessment/health-assessment',
    })
  },
  
  navigateToHealthPlan: function() {
    wx.navigateTo({
      url: '../health-plan/health-plan',
    })
  },
  
  navigateToBusiness: function() {
    wx.navigateTo({
      url: '../business/business',
    })
  },
  
  navigateToFeedback: function() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  
  navigateToSettings: function() {
    wx.navigateTo({
      url: '../settings/settings',
    })
  }
}) 
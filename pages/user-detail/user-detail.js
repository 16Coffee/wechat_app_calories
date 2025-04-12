Page({
  data: {
    userInfo: {
      nickname: '无糖友友_5bt3tj',
      userId: '无糖友友_5bt3tj',
      gender: '男',
      birthday: '1995-11-19',
      height: '181.0',
      currentWeight: '74.4',
      targetWeight: '75.0'
    },
    isEditing: false,
    showDialog: false,
    dialogTitle: '',
    dialogType: '',
    dialogValue: '',
    genderOptions: ['男', '女'],
    tempUserInfo: {}
  },
  
  onLoad: function(options) {
    // 从缓存或全局数据中加载用户信息
    // 这里简单使用固定数据
    // 实际应用中应该从服务器或本地存储获取
  },
  
  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },
  
  // 切换编辑模式
  toggleEditMode: function() {
    if (this.data.isEditing) {
      // 保存编辑结果
      this.saveUserInfo();
    } else {
      // 进入编辑模式，复制一份数据用于编辑
      this.setData({
        isEditing: true,
        tempUserInfo: JSON.parse(JSON.stringify(this.data.userInfo))
      });
    }
  },
  
  // 保存用户信息
  saveUserInfo: function() {
    // 实际应用中应该调用API保存到服务器
    // 这里简单更新本地数据
    wx.showLoading({
      title: '保存中...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      this.setData({
        isEditing: false
      });
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    }, 1000);
  },
  
  // 编辑性别
  editGender: function() {
    wx.showActionSheet({
      itemList: this.data.genderOptions,
      success: res => {
        if (!res.cancel) {
          const gender = this.data.genderOptions[res.tapIndex];
          this.setData({
            'userInfo.gender': gender
          });
        }
      }
    });
  },
  
  // 编辑生日
  editBirthday: function() {
    wx.showToast({
      title: '请在下方选择日期',
      icon: 'none'
    });
    
    this.setData({
      showDialog: true,
      dialogTitle: '选择生日',
      dialogType: 'date',
      dialogValue: this.data.userInfo.birthday
    });
  },
  
  // 编辑身高
  editHeight: function() {
    this.setData({
      showDialog: true,
      dialogTitle: '输入身高',
      dialogType: 'number',
      dialogValue: this.data.userInfo.height
    });
  },
  
  // 编辑当前体重
  editCurrentWeight: function() {
    this.setData({
      showDialog: true,
      dialogTitle: '输入当前体重',
      dialogType: 'digit',
      dialogValue: this.data.userInfo.currentWeight
    });
  },
  
  // 编辑目标体重
  editTargetWeight: function() {
    this.setData({
      showDialog: true,
      dialogTitle: '输入目标体重',
      dialogType: 'digit',
      dialogValue: this.data.userInfo.targetWeight
    });
  },
  
  // 更新对话框输入值
  updateDialogValue: function(e) {
    this.setData({
      dialogValue: e.detail.value
    });
  },
  
  // 确认对话框
  confirmDialog: function() {
    const { dialogType, dialogValue } = this.data;
    
    switch (dialogType) {
      case 'date':
        this.setData({
          'userInfo.birthday': dialogValue
        });
        break;
      case 'number':
        this.setData({
          'userInfo.height': dialogValue
        });
        break;
      case 'digit':
        if (this.data.dialogTitle.includes('当前体重')) {
          this.setData({
            'userInfo.currentWeight': dialogValue
          });
        } else if (this.data.dialogTitle.includes('目标体重')) {
          this.setData({
            'userInfo.targetWeight': dialogValue
          });
        }
        break;
    }
    
    this.closeDialog();
  },
  
  // 关闭对话框
  closeDialog: function() {
    this.setData({
      showDialog: false,
      dialogTitle: '',
      dialogType: '',
      dialogValue: ''
    });
  }
}) 
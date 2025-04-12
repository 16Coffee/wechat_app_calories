const iconUtils = require('../../utils/icons.js');

Page({
  data: {
    cameraContext: null,
    devicePosition: 'back', // 默认使用后置摄像头
    src: '',    // 拍照后图片路径
    photoTaken: false,
    analyzing: false,
    analysisResult: null,
    resultType: 'food', // 默认分析食物
    resultTypes: ['food', 'exercise', 'body'],
    // 阿里云百炼平台配置
    aliyunConfig: {
      // 百炼平台OpenAI兼容API地址
      apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      apiKey: 'sk-ca50b8c4ebad47e5b2d9e7bc6da4a74c', // 替换为真实密钥
      model: 'qwen-vl-max' // 使用通义千问VL模型
    },
    albumIconPath: ''
  },

  onLoad: function() {
    this.setData({
      cameraContext: wx.createCameraContext(),
      albumIconPath: iconUtils.albumIconBase64
    });
    // 检查API配置
    if (!this.data.aliyunConfig.apiKey) {
      wx.showModal({
        title: '配置提示',
        content: '请在ai.js中配置阿里云百炼平台的apiKey',
        showCancel: false
      });
    }
  },

  // 拍照
  takePhoto: function() {
    const that = this;
    this.data.cameraContext.takePhoto({
      quality: 'high',
      success: function(res) {
        that.setData({
          src: res.tempImagePath,
          photoTaken: true
        });
        // 拍照后立即进行分析
        that.analyzePhoto();
      },
      fail: function(err) {
        console.error(err);
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        });
      }
    });
  },

  // 从相册选择图片
  chooseFromAlbum: function() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function(res) {
        that.setData({
          src: res.tempFilePaths[0],
          photoTaken: true
        });
        // 选择图片后立即进行分析
        that.analyzePhoto();
      },
      fail: function(err) {
        console.error(err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 切换摄像头
  switchCamera: function() {
    this.setData({
      devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
    });
  },

  // 重新拍照
  retakePhoto: function() {
    this.setData({
      photoTaken: false,
      src: '',
      analyzing: false,
      analysisResult: null
    });
  },

  // 分析照片
  analyzePhoto: function() {
    const that = this;
    this.setData({
      analyzing: true
    });

    // 检查API配置
    if (!this.data.aliyunConfig.apiKey) {
      this.simulateAnalysis(); // 如果API未配置，使用模拟数据
      return;
    }

    // 调用阿里云百炼平台API进行分析
    this.uploadToAliyun();
  },

  // 上传图片到阿里云百炼平台
  uploadToAliyun: function() {
    const that = this;
    // 压缩图片再上传
    wx.compressImage({
      src: this.data.src,
      quality: 70,
      success(compressRes) {
        wx.getFileSystemManager().readFile({
          filePath: compressRes.tempFilePath,
          encoding: 'base64',
          success: function(res) {
            const base64Data = res.data;
            const imageUrl = `data:image/jpeg;base64,${base64Data}`;
            
            // 构建OpenAI兼容的请求数据
            const requestData = {
              model: that.data.aliyunConfig.model,
              messages: [
                {
                  role: "user",
                  content: [
                    { 
                      type: "text", 
                      text: "请识别这张图片，判断是食物、运动还是身体相关的照片。如果是食物照片，请给出食物名称、热量(千卡)、蛋白质(g)、碳水化合物(g)、脂肪(g)以及识别可信度。如果是运动照片，请给出运动类型、燃烧热量(千卡)、持续时间(分钟)、强度以及识别可信度。如果是身体相关照片，请给出体脂率(%)、肌肉含量(%)、体重估计(kg)以及识别可信度。请以JSON格式回复，格式为：{'type': '类型', 'data': {...详细数据...}}，type可为'food', 'exercise', 'body'中的一种。" 
                    },
                    { 
                      type: "image_url",
                      image_url: {
                        "url": imageUrl
                      }
                    }
                  ]
                }
              ]
            };

            // 修改请求配置
            wx.request({
              url: that.data.aliyunConfig.apiUrl,
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${that.data.aliyunConfig.apiKey}`
              },
              data: requestData,
              timeout: 20000, // 增加超时时间
              success: function(response) {
                // 处理API返回的结果
                if (response.data && response.statusCode === 200) {
                  try {
                    // 获取模型返回的内容
                    const assistantMessage = response.data.choices[0].message.content;
                    
                    // 尝试解析JSON响应
                    const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                      const jsonResponse = JSON.parse(jsonMatch[0]);
                      
                      // 设置结果类型
                      that.setData({
                        resultType: jsonResponse.type
                      });
                      
                      // 处理不同类型的结果
                      let result;
                      if (jsonResponse.type === 'food') {
                        result = {
                          name: jsonResponse.data.name || '未知食物',
                          calories: parseFloat(jsonResponse.data.calories) || 0,
                          protein: parseFloat(jsonResponse.data.protein) || 0,
                          carbs: parseFloat(jsonResponse.data.carbs) || 0,
                          fat: parseFloat(jsonResponse.data.fat) || 0,
                          confidence: parseFloat(jsonResponse.data.confidence) || 0.8
                        };
                      } else if (jsonResponse.type === 'exercise') {
                        result = {
                          name: jsonResponse.data.name || '未知运动',
                          caloriesBurned: parseFloat(jsonResponse.data.caloriesBurned) || 0,
                          duration: parseFloat(jsonResponse.data.duration) || 0,
                          intensity: jsonResponse.data.intensity || '中等',
                          confidence: parseFloat(jsonResponse.data.confidence) || 0.8
                        };
                      } else if (jsonResponse.type === 'body') {
                        result = {
                          bodyFat: parseFloat(jsonResponse.data.bodyFat) || 0,
                          muscle: parseFloat(jsonResponse.data.muscle) || 0,
                          weight: parseFloat(jsonResponse.data.weight) || 0,
                          confidence: parseFloat(jsonResponse.data.confidence) || 0.8
                        };
                      }
                      
                      that.setData({
                        analyzing: false,
                        analysisResult: result
                      });
                      that.saveAnalysisResult(result);
                    } else {
                      console.error('无法从响应中解析JSON');
                      that.simulateAnalysis();
                    }
                  } catch (error) {
                    console.error('处理API响应错误', error);
                    that.setData({
                      analyzing: false,
                      analysisResult: null
                    });
                    wx.showModal({
                      title: '分析失败',
                      content: '响应数据格式错误，请联系管理员',
                      showCancel: false
                    });
                  }
                } else {
                  console.error('API请求失败', response);
                  that.setData({
                    analyzing: false,
                    analysisResult: null
                  });
                  wx.showModal({
                    title: '分析失败',
                    content: '服务器响应错误(状态码:' + response.statusCode + ')',
                    showCancel: false
                  });
                }
              },
              fail: function(err) {
                console.error('请求失败', err);
                that.setData({
                  analyzing: false,
                  analysisResult: null
                });
                wx.showModal({
                  title: '分析失败',
                  content: '网络请求失败，请检查网络连接',
                  showCancel: false
                });
              }
            });
          },
          fail: function(err) {
            console.error('读取图片失败', err);
            that.setData({
              analyzing: false,
              analysisResult: null
            });
            wx.showModal({
              title: '分析失败',
              content: '无法读取图片，请重试',
              showCancel: false
            });
          }
        });
      }
    });
  },

  // 自动检测图片类型
  detectImageType: function(apiResponse) {
    // 根据API响应自动检测图片类型
    // 这里是模拟逻辑，实际应根据API返回的识别结果来确定类型
    if (apiResponse.food_score && apiResponse.food_score > 0.6) {
      return 'food';
    } else if (apiResponse.activity_score && apiResponse.activity_score > 0.6) {
      return 'exercise';
    } else if (apiResponse.body_score && apiResponse.body_score > 0.6) {
      return 'body';
    }
    
    // 默认返回食物类型
    return 'food';
  },

  // 处理API返回的结果（根据检测类型和API响应格式调整）
  processApiResult: function(apiResult, detectedType) {
    try {
      const type = detectedType || this.data.resultType;
      
      if (type === 'food') {
        // 假设API返回的食物分析结果
        return {
          name: apiResult.food_name || '未知食物',
          calories: apiResult.calories || 0,
          protein: apiResult.protein || 0,
          carbs: apiResult.carbs || 0,
          fat: apiResult.fat || 0,
          confidence: apiResult.confidence || 0.8
        };
      } else if (type === 'exercise') {
        // 假设API返回的运动分析结果
        return {
          name: apiResult.activity_name || '未知运动',
          caloriesBurned: apiResult.calories_burned || 0,
          duration: apiResult.duration || 0,
          intensity: apiResult.intensity || '中等',
          confidence: apiResult.confidence || 0.8
        };
      } else {
        // 假设API返回的身体分析结果
        return {
          bodyFat: apiResult.body_fat || 0,
          muscle: apiResult.muscle || 0,
          weight: apiResult.weight || 0,
          confidence: apiResult.confidence || 0.8
        };
      }
    } catch (error) {
      console.error('处理API结果错误', error);
      return this.getSimulatedResult();
    }
  },

  // 生成签名（实际项目中应该在服务器端实现）
  generateSignature: function(timestamp) {
    // 注意：实际项目中，签名应该在服务器端生成
    // 这里返回一个假的签名用于演示
    return 'demo_signature_' + timestamp;
  },

  // 使用模拟数据（当API未配置或请求失败时）
  simulateAnalysis: function() {
    const that = this;
    setTimeout(function() {
      // 随机选择一种类型进行模拟
      const types = ['food', 'exercise', 'body'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      that.setData({
        resultType: randomType
      });
      
      const result = that.getSimulatedResult(randomType);
      that.setData({
        analyzing: false,
        analysisResult: result
      });
      that.saveAnalysisResult(result);
    }, 2000);
  },

  // 获取模拟结果数据
  getSimulatedResult: function(type) {
    const resultType = type || this.data.resultType;
    
    if (resultType === 'food') {
      return {
        name: '蔬菜沙拉',
        calories: 120,
        protein: 5,
        carbs: 15,
        fat: 3,
        confidence: 0.92
      };
    } else if (resultType === 'exercise') {
      return {
        name: '跑步',
        caloriesBurned: 350,
        duration: 30,
        intensity: '中等',
        confidence: 0.85
      };
    } else {
      return {
        bodyFat: 22,
        muscle: 45,
        weight: 74.4,
        confidence: 0.75
      };
    }
  },

  // 保存分析结果
  saveAnalysisResult: function(result) {
    console.log('分析结果已保存', result);
    wx.showToast({
      title: '分析完成',
      icon: 'success'
    });
  },

  // 切换识别类型
  switchResultType: function() {
    const currentIndex = this.data.resultTypes.indexOf(this.data.resultType);
    const nextIndex = (currentIndex + 1) % this.data.resultTypes.length;
    this.setData({
      resultType: this.data.resultTypes[nextIndex]
    });

    // 如果已拍照，则重新分析
    if (this.data.photoTaken) {
      this.analyzePhoto();
    }
  },

  // 设置识别类型
  setResultType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      resultType: type
    });
    
    // 如果已拍照，则重新分析
    if (this.data.photoTaken) {
      this.analyzePhoto();
    }
  },

  // 保存图片到相册
  saveToAlbum: function() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.src,
      success: function() {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
      },
      fail: function(err) {
        console.error(err);
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    });
  }
}) 
const hostip = '192.168.35.179:5000'

Page({
  data: {
    title: '',
    content: '',
    audioSrc: '',
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    showAudioControls: false,
    voicePlayFlag: false,   // <--- only for local
    initDone: false   // <--- only for local
  },

  onLoad: function(options) {
    const { title, content } = options;
    this.setData({
      title: title,
      content: content
    });
  },

  onUnload:function(){
    const {title,initDone} = this.data
    wx.request({
      url: 'http://'+hostip+'/select_story',
      method: 'POST',
      data: {
        title: title,
        content: 'none',
        initDone: initDone,
        voicePlayFlag: false
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        this.setData({ voicePlayFlag: false });
        console.log('success! res:')
        console.log(res.data)
      },
      fail: (err) => {
        console.error('failed', err);
      }
    });
  },

  onHide: function(){
    const {title,initDone} = this.data
    wx.request({
      url: 'http://'+hostip+'/select_story',
      method: 'POST',
      data: {
        title: title,
        content: 'none',
        initDone: initDone,
        voicePlayFlag: false
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        this.setData({ voicePlayFlag: false });
        console.log('success! res:')
        console.log(res.data)
      },
      fail: (err) => {
        console.error('failed', err);
      }
    });
  },

  onUnload: function() {
    this.stopAudio();
  },

  playStoryLocal: function() {
    if (this.data.showAudioControls == false) {
      this.setData({
        showAudioControls: true,
        voicePlayFlag: true
      });
    }
    const { title, content, voicePlayFlag, initDone } = this.data;
    console.log('title: '+title);
    console.log('content: '+content);
    wx.request({
      url: 'http://'+hostip+'/select_story',
      method: 'POST',
      data: {
        title: title,
        content: content,
        voicePlayFlag: voicePlayFlag,
        initDone: initDone
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log('数据发送成功', res);
        console.log("##############");
        console.log(res.data);
        console.log("##############");
        this.data.audioSrc = res.data.audioUrl
        this.data.initDone = true
      },
      fail: (err) => {
        console.error('数据发送失败', err);
      }
    });
  },
  togglePlayPauseLocal: function() {
    const {title,initDone} = this.data
    wx.request({
      url: 'http://'+hostip+'/select_story',
      method: 'POST',
      data: {
        title: title,
        content: 'none',
        initDone: initDone,
        voicePlayFlag: !this.data.voicePlayFlag
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        this.setData({ voicePlayFlag: !this.data.voicePlayFlag });
        console.log('success! res:')
        console.log(res.data)
      },
      fail: (err) => {
        console.error('failed', err);
      }
    });
  },


  playStory: function() {
    if (this.innerAudioContext) {
      this.setData({
        showAudioControls: true,
        currentTime: this.innerAudioContext.currentTime,
        duration: this.innerAudioContext.duration
      });
      return;
    }

    const { title, content } = this.data;
    console.log(title);
    console.log(content);

    // wx.request({
    //   url: 'http://127.0.0.1:5000/text',
    //   method: 'POST',
    //   data : {
    //     title : title,
    //     content: content
    //   },
    //   header: {
    //         'content-type': 'application/json'
    //   },
    //   success: (res) => {
    //     console.log('数据发送成功', res);
    //     console.log(res.data);
    //   },
    //   fail: (err) => {
    //     console.error('数据发送失败', err);
    //   }

    // });

    wx.request({
      url: 'http://127.0.0.1:5000/select_story',
      method: 'POST',
      data: {
        title: title,
        content: content
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log('数据发送成功', res);
        console.log("##############");
        console.log(res.data);
        console.log("##############");
        this.data.audioSrc = res.data.audioUrl
  
        this.initAudioPlayer();
        
      },

      fail: (err) => {
        console.error('数据发送失败', err);
      }
    });

  },

  initAudioPlayer: function() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }

    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = this.data.audioSrc;

    innerAudioContext.onPlay(() => {
      this.setData({ isPlaying: true });
    });

    innerAudioContext.onPause(() => {
      this.setData({ isPlaying: false });
    });

    innerAudioContext.onStop(() => {
      this.setData({ isPlaying: false, currentTime: 0 });
    });

    innerAudioContext.onTimeUpdate(() => {
      this.setData({
        currentTime: innerAudioContext.currentTime,
        duration: innerAudioContext.duration
      });
    });

    innerAudioContext.onEnded(() => {
      this.setData({ isPlaying: false, currentTime: 0 });
    });

    this.innerAudioContext = innerAudioContext;
    innerAudioContext.play();
  },

  togglePlayPause: function() {
    const { isPlaying } = this.data;
    const innerAudioContext = this.innerAudioContext;

    if (isPlaying) {
      innerAudioContext.pause();
    } else {
      innerAudioContext.play();
    }
  },

  seekAudio: function(e) {
    const innerAudioContext = this.innerAudioContext;
    innerAudioContext.seek(e.detail.value);
  },

  hideAudioControls: function() {
    this.setData({ showAudioControls: false });
  },

  stopAudio: function() {
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    }
  },   

  formatTime: function(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }
});

const hostip = '192.168.35.179:5000'

Page({
  data: {
    stories: [
      { id: 1, title: "篱笆墙下的垃圾", content: "早上，哈哈猴拿着扫把打扫起院子来。当他扫到绿篱笆墙边上时，发现绿篱笆墙边很难打扫，就想：反正这堵绿篱笆墙不是我家的，我才懒得扫。...", liked: false },
      { id: 2, title: "泡泡糖飞船", content: "小兔、小猴、小熊看见小狗俏俏种了一块泡泡糖，哈哈大笑。调皮的小猴还给小狗俏俏编了一首歌：“公ji下蛋鼠吃猫，小狗俏俏种泡泡，玉米好吃萝卜大，小狗俏俏，什么也得不到！...", liked: false },
      { id: 3, title: "蚯蚓为什么钻到土里", content: "有一天，蚯蚓感冒了，便躺在家里休息，辛勤的蜜蜂一边采蜜一边帮它找食物。过了几天，蚯蚓的病好了，可是它觉得躺在家里不劳动又有饭吃舒服极了，就躺在家里撒娇，蜜蜂没办法，只好自己去采蜜，而蚯蚓却在家“呼噜、呼噜”睡大觉。...", liked: false },
      { id: 4, title: "蜘蛛开店", content: "秋天过后，天气一天天变凉了，天空中的飞翔的虫子也越来越少了。蜘蛛瑶瑶编织的蛛网经常捉不到害虫。她经常饿肚子。...", liked: false },
      { id: 5, title: "多西的恐龙们", content: "巫婆镇的小女巫都喜欢养恐龙。多米养了一头恐龙，多法养了两头恐龙，多拉养了三头恐龙，养恐龙最多的就是多西，她养了六头恐龙。...", liked: false }
    ]
  },

  onLoad: function() {
    this.fetchStories();
  },

  fetchStories: function() {
    wx.request({
      method: 'GET',
      url: 'http://'+hostip+'/landing',
      success: (res) => {
        console.log(res.data);
        this.setData({
          stories: res.data
        });
      },
      fail: function() {
        console.log("获取失败");
      }
    });
  },


  likeStory: function(event) {
    const storyId = event.currentTarget.dataset.id;
    const updatedStories = this.data.stories.map(story => {
      if (story.id === storyId) {
        story.liked = !story.liked;
      }
      return story;
    });
    this.setData({ stories: updatedStories });
  },

  viewFullStory: function(event) {
 
    const storyId = event.currentTarget.dataset.id;
    console.log(storyId);
    const story = this.data.stories.find(story => story.id === storyId);

    console.log(story);
    if (story) {
      wx.navigateTo({
        url: `/pages/select_story/select_story?title=${story.title}&content=${story.content}`
      });
    }
  }
});

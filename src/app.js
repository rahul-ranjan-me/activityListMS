((win) => {
    class ActivitList{
      constructor(){
        this.data = {}
        this.finalDataArray = []
        this.subscribeFeed()
      }
  
      subscribeFeed(){
        window.Activity.subscribe(function(activities) {
          this.init(activities)
        }.bind(this));
      }
  
      init(feed){
        feed && feed.length ? feed.map(this.calculateFinalFeedToRender.bind(this)) : null
        const data = this.data
  
        Object.keys(data).map((item) => {
          Object.keys(data[item]).map((action) => {
            this.finalDataArray.push(data[item][action])
          })
        })
  
        this.finalDataArray.sort((a, b) => {
          if(a.generatedAt > b.generatedAt){
            return -1
          }
          if(b.generatedAt > a.generatedAt){
            return 1
          }
          return 0
        })
  
        const objToRender = this.finalDataArray.map((item) => {
          return this.createItem(item)
        })
  
        document.getElementById('activity-list').innerHTML = objToRender
      }
  
      flattenFeedData(src, feed){
        for(var i in feed){
          src[i] = feed[i]
        }
      }
  
      calculateFinalFeedToRender(feed){
        const { activityId, type, byUser, message, generatedAt } = feed
            , { firstName } = byUser
            , data = this.data
  
        if(data[activityId] && data[activityId][type] && type !== 'atmention'){
          let number = data[activityId][type].number
          if(type === 'reply' && byUser.userId.indexOf(data[activityId][type].users) !== -1){
            data[activityId][type].generatedAt = generatedAt
          }else{
            number++
            data[activityId][type].number = number
            data[activityId][type].title = `${firstName} and ${number}+ ${type} to your post`
            data[activityId][type].message = message
            data[activityId][type].generatedAt = generatedAt
          }
        }else if(data[activityId] && type !== 'atmention'){
            data[activityId][type] = {
              number: 1,
              title: `${firstName} ${type} to your post`,
              users: [byUser.userId]
            }
            this.flattenFeedData(data[activityId][type], feed)
        }else{
            data[activityId] = {}
            data[activityId][type] = {
              number: 1,
              title: `${firstName} ${type === 'atmention' ? 'mention' : type} to your post`,
              users: [byUser.userId]
            }
            this.flattenFeedData(data[activityId][type], feed)
        }
        return data
      }
  
      createItem(item){
        const { title, byUser, type, generatedAt, team, channel, message } = item
            , { imageDataUri } = byUser
        return `<li class="activity">
                  <div class="person">
                      <img src=${imageDataUri} alt="Person+${imageDataUri}" width="30" />
                  </div>
                  <div class="activity-details">
                      <date>${this.getFormattedDate(generatedAt)}</date>
                      <h2><img src="resources/${this.getImage(type)}" alt="cross" class="activity-image" /> ${title}</h2>
                      <p class="prop">${team} > ${channel}</p>
                      <p>${message}</p>
                  </div>
              </li>`
      }
  
      getImage(type){
        let imageType;
  
        switch(type) {
            case 'atmention':
                imageType = 'atmention.svg'
                break;
            case 'cross':
                imageType = 'cross.svg'
                break;
            case 'options':
                imageType = 'options.svg'
                break;
            case 'reaction':
                imageType = 'reaction.svg'
                break;
            case 'reply':
                imageType = 'reply.svg'
                break;
            default:
                imageType = 'reaction.svg'
        }
        return imageType
      }
  
      getFormattedDate(str){
        const date = new Date(str)
        const formatTwoDigit = (dig) => {
            return dig < 10 ? '0'+dig : dig
        }
        return `${formatTwoDigit(date.getDate())}\/${formatTwoDigit(date.getMonth())} ${formatTwoDigit(date.getHours())}:${formatTwoDigit(date.getMinutes())}`
      }
      
    }
  
    new ActivitList()
  })(window);
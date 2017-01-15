var channelList = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas","brunofin","comster404"];
var channelInfo = [];

function clearChannelList() {
  $(".stream_list").html("");
}

function displayChannel(channelObj) {
  var html = "";
  html += "<div class='row text-center channelEntry'>";
  html += "<div class='col-xs-1 logo'><img class='img-circle channelImage' src='" + channelObj.logo + "'></div>";
  html += "<div class='col-xs-3 vertical-centered'><a href='" + channelObj.url + "' target='_blank'>" + channelObj.displayName + "</a></div>";
  html += "<div class='col-xs-8 vertical-centered'>" + channelObj.description + "</div>";
  html += "</div>";
  $(".stream_list").append(html);
}

function displayAlert(message) {
  var html = "";
  html += "<div class='alert alert-danger alert-dismissible' role='alert'>";
  html += "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
  html += message;
  html += "</div>";
  
  $(".alerts").append(html);
}

function getAllStreams() {
  for (var i = 0; i < channelList.length; i++) { 
    var url = "https://wind-bow.gomix.me/twitch-api/streams/" + channelList[i] + "?callback=?";
    $.getJSON(url, function(data) {
      
      console.log(JSON.stringify(data));
      
      if(data.hasOwnProperty("error")) {
        displayAlert(data.message);
        return;
      }
      
      // Channel is offline
      if(data.stream == null) {
        var string = data["_links"].channel;
        var idx = string.lastIndexOf("/") + 1;
        var name = string.substr(idx, string.length);
        
        var channelURL = "https://wind-bow.gomix.me/twitch-api/channels/" + name + "?callback=?";
        $.getJSON(channelURL, function(channelData) {
          
          console.log(JSON.stringify(channelData));
          
          if(channelData.hasOwnProperty("error")) {
            displayAlert(channelData.message);
            return;
          }

          var newChannel = {
            displayName: channelData.display_name,
            status: "offline",
            description: "Offline",
            logo: channelData.logo,
            url: channelData.url,
          };
          
          channelInfo.push(newChannel);
          displayChannel(newChannel);
        });
        
        return;
      } 
      
      // Channel is streaming:
      var newChannel = {
        displayName: data.stream.channel.display_name,
        status: "online",
        description: data.stream.game + ": " + data.stream.channel.status,
        logo: data.stream.channel.logo,
        url: data.stream.channel.url,   
      };

      channelInfo.push(newChannel);  
      displayChannel(newChannel);
      //
  
    });
    
  }
}

$(document).ready(function() {
  getAllStreams();
});

//filterID: allChannels, onlineChannels, offlineChannels
function refreshDisplayedChannels(filterID) {
  clearChannelList();
  
  $(".stream_list").append("<div id='" + filterID + "' class='tab-pane fade'>");
  
  for (var i = 0; i < channelInfo.length; i++) {
    
    if(filterID == "onlineChannels" && channelInfo[i].status == "offline") {
       continue;
    }
    
    if(filterID == "offlineChannels" && channelInfo[i].status != "offline") {
       continue;
    }
    
    displayChannel(channelInfo[i]);
    
  }
  
  $(".stream_list").append("</div>");
}

$("#allChannelsButton").click(function() {
  refreshDisplayedChannels("allChannels");
});

$("#onlineChannelsButton").click(function() {
  refreshDisplayedChannels("onlineChannels");
});

$("#offlineChannelsButton").click(function() {
  refreshDisplayedChannels("offlineChannels");
});
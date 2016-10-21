// https://www.googleapis.com/youtube/v3/search?key=AIzaSyDxeZIQD41Ab-gO0Z7ZD5Mjzgf6BGhGm6I&part=snippet&q=gundam&maxResults=20
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function initCarousel() {
  $('.videos-list').slick({
    slidesToShow: 4,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });
}

$(document).ready(function () {

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });
  
  var timeRegex = /PT(\d+H)*(\d+M)*(\d+S)*/;
  var $form = $('form.video-add');
  
  initCarousel();
  
  $('.results-list').delegate('.results-item', 'click', function() {
    // Asign form value
    $form.find('input[name="title"]').val($(this).data('title'));
    $form.find('input[name="yt_id"]').val($(this).data('yt_id'));
    $form.find('input[name="duration"]').val($(this).data('duration'));

    // Ajax post submit
    $.post($form.attr('action'), $form.serialize(), function(data) {
      $('.videos-list').slick('slickAdd', data);
      $('.videos-list').slick('slickGoTo', parseInt(vIndex, 10));
    })
    .fail(function(jqXHR, textStatus) {
      alert(jqXHR.responseText);
    });
  });
  
  $('.yt-search').on('submit', function(e) {
    e.preventDefault();
    if ($(this).find("input[type=text]").val()) {
      $('.results-list').empty();
      $.get('https://www.googleapis.com/youtube/v3/search', {
        key: "AIzaSyAgCn1UKpt-Lcb-AmdAU_1ij-OjC_luFUQ",
        part: "snippet",
        type: 'id',
        maxResults: 20,
        q: $(this).find("input[type=text]").val()
      }, function(data) {
        var vids = [];
        data.items.forEach(function(video) {
          vids.push(video.id.videoId);
        });
        $.get('https://www.googleapis.com/youtube/v3/videos', {
          key: "AIzaSyAgCn1UKpt-Lcb-AmdAU_1ij-OjC_luFUQ",
          part: "snippet,contentDetails",
          id: vids.join(),
        }, function(result) {
          result.items.forEach(function(video) {
            var $item = $("<div />").addClass('results-item');
            var $itemF = $("<div />").addClass('pull-left');
            var $itemS = $("<div />").addClass('pull-left');
            var $overlay = $("<div />").addClass('overlay').text("Add to Playlist");
            
            $itemF.append($("<img />").attr("src", video.snippet.thumbnails.default.url));
            
            $itemS.append($("<p />").text(video.snippet.title));
            
            var matches = video.contentDetails.duration.match(timeRegex);
            var vtime = "";
            if (matches) {
              vtime = pad(matches[2].slice(0, -1), 2) + ":" + pad(matches[3].slice(0, -1), 2);
              if (typeof matches[1] !== 'undefined') {
                vtime =  pad(matches[1].slice(0, -1), 2)  + ":" + vtime;
              } else {
                vtime = "00:" + vtime;
              }
              $itemS.append($("<span />").text(vtime));  
            }
            $item.data({
              yt_id: video.id,
              title: video.snippet.title,
              duration: vtime
            });
            $item.append($overlay, $itemF, $itemS);
            
            $('.results-list').append($item);
          });
        });
      }, 'json'); 
    }
  })

});
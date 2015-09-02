// To make images retina, add a class "2x" to the img element
// and add a <image-name>@2x.png image. Assumes jquery is loaded.
 
function isRetina() {
	var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
					  (min--moz-device-pixel-ratio: 1.5),\
					  (-o-min-device-pixel-ratio: 3/2),\
					  (min-resolution: 1.5dppx)";
 
	if (window.devicePixelRatio > 1)
		return true;
 
	if (window.matchMedia && window.matchMedia(mediaQuery).matches)
		return true;
 
	return false;
}
 
 
function retina() {
	
	if (!isRetina())
		return;
	
	$("img.2x").map(function(i, image) {
		
		var path = $(image).attr("src");
		
		path = path.replace(".png", "@2x.png");
		path = path.replace(".jpg", "@2x.jpg");
		
		$(image).attr("src", path);
	});
}
 
$(document).ready(retina);


function init_audio_player(player_id)
{
    var el = document.getElementById('audio_'+player_id),
        audio = audiojs.create(el, {
            trackEnded: function () {
                var next = $('#'+player_id+' li.playing').next();
                if (!next.length) next = $('ol.playlist li').first();
                next.addClass('playing').siblings().removeClass('playing');
                audio.load($('a.cplay', next).attr('data-src'));
                audio.play();
            }
        });

    // Load in the first track
    var first = $('#'+player_id+' a.cplay').attr('data-src');

    $('#'+player_id+' li').first().addClass('playing');
    audio.load(first);

    // Load in a track on click
    $('#'+player_id+' li a.cplay').click(function (e) {
        e.preventDefault();
        $(this).parent('li').addClass('playing').siblings().removeClass('playing');
        audio.load($(this).attr('data-src'));
        audio.play();
    });
}
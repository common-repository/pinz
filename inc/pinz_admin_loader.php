<script type="text/javascript">
    
      (function($) {
            $(document).ready(function() {
                $baseUrl = $('.button').attr('href');
                window.setInterval(function(){  
                    $('.button').attr('href', $baseUrl + '&' + (Math.floor(Math.random()*9000) + 1000) )
                }, 1000);
            })
        })(jQuery);
            
    
</script>

<div class="wrap pinz_admin_loader">
    <h2>Pinz <span style="font-size:xx-small" id="#pinz_version">1.2</span> / <span style="font-size:xx-small"> by SolidRock ©2014</span></h2>

    <div id="welcome-panel" class="welcome-panel">
        <div class="welcome-panel-content">
            <a class="welcome-panel-close " href="http://www.solidrock.fr/wordpress/">Pinz is a plugin developped by SolidRock</a>
            <h3>Pin anything, anywhere !</h3>
            <p class="about-description">Pinz allows you to pin any post/page anywhere on your website.</p>
            <div class="welcome-panel-column-container">
                <div class="welcome-panel-column">
                    <h4>Get Started</h4>
                    <a class="button button-primary button-hero load-customize" href="<?php echo admin_url('admin.php?page=pinz' ) ?>">Launch Pinz!</a>
                </div>
                <div class="welcome-panel-column">
                    <h4>More...</h4>
                    <ul>
                        <li><a href="http://www.solidrock.fr/wordpress/pinz" class="welcome-icon welcome-learn-more">Learn more about how to Pinz (Help)</a></li>
                        <li><a href="http://www.solidrock.fr/wordpress/pinz" class="welcome-icon welcome-view-site">Check for update</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

</div>
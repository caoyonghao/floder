(function() {
    var basicdir = "";
    var prefixDir = "";
    var domCache = [];

    initSocket();
    $('#back_btn').bind('click', function ()  {
        back();
    });
    $('#search_btn').bind('click', function() {
        var search_key = $('#search_value').val() ? $('#search_value').val() : '.';
        console.log(search_key)
        init(search_key);
    });
    $('#sort_btn').bind('click', function() {
        sort(domCache);
    });

    $('.list-group').bind('click', function(event) {
        if ($(event.target).hasClass('click_area')) {
            var requestPath = prefixDir + '/' + $(event.target).text();
            prefixDir = requestPath;
            initFlieDom(basicdir, requestPath);
        }
    });

    $('#floder_banner').bind('click', popAbout);

    function init(dir) {
        $.ajax({type: "post", url: "http://127.0.0.1:3000/fileInfo?path=" + dir, async: true, success: function (data) {
            basicdir = data;
        }})
    }

    function initBreadCrumb(basicdir, path) {
        var paths = [],
            $breadcrumbDom = $('.breadcrumb');
        $breadcrumbDom.empty();
        paths = (basicdir + path).split('/');
        paths.forEach(function(bread) {
            var $breadNode = $('<li><a onclick="return false"></a></li>');
            $breadNode.find('a').text(bread);
            $breadcrumbDom.append($breadNode);
        })

    }

    function initFlieDom(basicdir, path) {
        initBreadCrumb(basicdir, prefixDir);
        var $fileContainer = $('#file_list');
        $fileContainer.empty();
        $.ajax({type: "get", url: "http://127.0.0.1:3000/fileInfo?path=" + path + "&basicdir=" + basicdir, success: function (data) {
            domCache = [];
            data.sons.forEach(function (son) {
                var $fileDom = $('<li class="list-group-item"><span class="badge"></span><label class="click_area"></label></li>');
                $fileDom.find('.badge').text(parseFileSize(son.size));
                $fileDom.find('label').text(son.name);
                $fileDom.data('size', son.size);
                if (son.isHasSon) {
                    $fileDom.find('label').addClass('can_click');
                    domCache.unshift($fileDom);
                } else {
                    domCache.push($fileDom);
                }
            })
            $fileContainer.append(domCache);
        }})
    }
    function sort(data) {
        data.sort(function(a, b) {
            return a.data('size') < b.data('size') ? 1 : -1;
        })
        $('#file_list').empty().append(data);
    }

    function back() {
        prefixDir = prefixDir.substring(0, prefixDir.lastIndexOf('/'));
        initFlieDom(basicdir, prefixDir);
    }
    function parseFileSize(size) {
        var fileSize = size / 1024;
        var PATTERN = 'KB';
        if (fileSize > 1024) {
            PATTERN = "MB";
            fileSize = fileSize / 1024;
        }
        return Math.round(fileSize*100)/100 + PATTERN;
    }



    function initSocket() {
        var socket = io.connect('http://127.0.0.1:3001');
        var $scanProcess = $('#scan_progress');
        var isRunning = false;
        socket.on('filescaner.running', function (data) {//接收到服务器发送过来的名为'new'的数据

            if (data.status == "start") {
                isRunning = true;
                $scanProcess.show();
            }

            if (data.status == "finish") {
                if (isRunning) {
                    isRunning = false;
                    socket.emit("client.finish");
                    $scanProcess.hide();
                    initFlieDom(basicdir, ',');
                }
            }

            if (data.status == "keep-alive") {
                console.log(new Date().getTime() + data);
            }
        });
        socket.on('filescaner.finish', function (data) {//接收到服务器发送过来的名为'new'的数据
            console.log('finish' + data);//data为应服务器发送过来的数据。
        });

    }

    function popAbout() {
        TINY.box.show({iframe: '/about.html', boxid: 'frameless', width: 750, height: 450, fixed: false, maskid: 'bluemask', maskopacity: 40, closejs: function () {}})
    }

}())

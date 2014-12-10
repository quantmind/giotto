
        paper.downloadPNG = function (e) {
            if (!g.cloudConvertApiKey)
                return;

            var params = {
                apikey: g.cloudConvertApiKey,
                inputformat: 'svg',
                outputformat: 'png'
            };

            var blob = new Blob(['base64,',paper.encode()], {type : 'image/svg+xml;charset=utf-8'});

            d3.xhr('https://api.cloudconvert.org/process?' + encodeObject(params))
                .header('content-type', 'multipart/form-data')
                .post(submit);

            function submit(_, request) {
                if (!request || request.status !== 200)
                    return;
                var data = JSON.parse(request.responseText);
                d3.xhr(data.url)
                    .post(encodeObject({
                        input: 'upload',
                        file: blob
                    }, 'multipart/form-data'), function (r, request) {
                        if (!request || request.status !== 200)
                            return;
                        data = JSON.parse(request.responseText);
                        wait_for_data(data);
                    });
            }

            function wait_for_data (data) {
                d3.xhr(data.url, function (r, request) {
                    if (!request || request.status !== 200)
                        return;
                    data = JSON.parse(request.responseText);
                    if (data.step === 'finished')
                        download(data.output);
                    else if (data.step === 'error')
                        error(data);
                    else
                        wait_for_data(data);
                });
            }

            function error (data) {

            }

            function download(data) {
                d3.select(e.target).attr("href", data.url + '?inline');
            }
        };
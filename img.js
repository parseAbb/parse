function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    let jpeg = '';
    try {
        jpeg = new Blob([u8arr], {type: mime});
    } catch (e) {
        // TypeError old chrome and FF
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if (e.name == 'TypeError' && window.BlobBuilder) {
            let bb = new BlobBuilder();
            bb.append([u8arr.buffer]);
            jpeg = bb.getBlob(mime);
        } else if (e.name == "InvalidStateError") {
            jpeg = new Blob([u8arr.buffer], {type: mime});
        }
    }

    // return new Blob([u8arr], {type: mime});
    return jpeg;
}

function send(imgObj, url) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", repairUrl(url) + '&parse=1', true);
    oReq.responseType = "text";
    oReq.onreadystatechange = function () {
        if (oReq.readyState == oReq.DONE) {
            var blob = 'data:image/png;base64, ' + oReq.response;
            let bolbUrl = dataURLtoBlob(blob);
            imgObj.src = URL.createObjectURL(bolbUrl)
            imgObj.setAttribute('data-original', bolbUrl)
        }
      
    }
    oReq.send();
}

// 解析所有img标签
function parseImgElement() {
    let imgs = document.getElementsByTagName('img');
    let url = '';
    for (let i = 0; i < imgs.length; i++) {
        let imgItem = imgs[i];
        let original = imgItem.getAttribute('data-original');
        let dataSrc = imgItem.getAttribute('data-src');
        if (original !== null && original.indexOf('/img/parse?resources=') > 0) {
            url = original.split(':')[1];
            if (original.split(':')[1]) {
                url = original.split(':')[1];
            } else {
                url = original;
            }

            send(imgItem, url);
            continue;
        }
        if (imgItem.src.indexOf('/img/parse?resources=') > 0) {
            if (imgItem.src.split(':')[1]) {
                url = imgItem.src.split(':')[1];
            } else {
                url = imgItem.src;
            }
            send(imgItem, url)
        }

        if (dataSrc !== null && dataSrc.indexOf('/img/parse?resources=') > 0) {
            url = dataSrc.split(':')[1];
            if (dataSrc.split(':')[1]) {
                url = dataSrc.split(':')[1];
            } else {
                url = dataSrc;
            }

            send(imgItem, url);
            continue;
        }
    }
}

// 解析所有A标签
function parseAElement() {
    let A = document.getElementsByTagName('a');
    let url = '';
    for (let i = 0; i < A.length; i++) {
        let AItem = A[i];
        let original = AItem.getAttribute('data-original');
        if (original !== null && original.indexOf('/img/parse?resources=') > 0) {
            if (original.split(':')[1]) {
                url = original.split(':')[1];
            } else {
                url = original
            }
            sendA(AItem, url, true);
            continue;
        }
        if (AItem.style.backgroundImage.indexOf('/img/parse?resources=') > 0) {
            let url = AItem.style.backgroundImage;
            url = url.replace('url("', '');
            url = url.replace('")', '');
            if (url.split(':')[1]) {
                url = url.split(':')[1];
            }
            sendA(AItem, url, true)
        }
    }
}

function parseDivElement() {
    let div = document.getElementsByTagName('div');
    let url = '';
    for (let i = 0; i < div.length; i++) {
        let divItem = div[i];
        let original = divItem.getAttribute('data-original');
        if (original !== null && original.indexOf('/img/parse?resources=') > 0) {
            if (original.split(':')[1]) {
                url = original.split(':')[1];
            } else {
                url = original
            }
            sendA(divItem, url, true);
            continue;
        }
        if (divItem.style.backgroundImage.indexOf('/img/parse?resources=') > 0) {
            let url = divItem.style.backgroundImage;
            url = url.replace('url("', '');
            url = url.replace('")', '');
            if (url.split(':')[1]) {
                url = url.split(':')[1];
            }
            sendA(divItem, url, true)
        }
    }
}

function sendA(AObj, url, back = false) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", repairUrl(url) + '&parse=1', true);
    oReq.responseType = "text";
    oReq.onreadystatechange = function () {
        if (oReq.readyState == oReq.DONE) {
            var blob = 'data:image/png;base64, ' + oReq.response;
            let blobUrl = URL.createObjectURL(dataURLtoBlob(blob))
            if (back) {
                AObj.style.backgroundImage = `url('${blobUrl}')`
                AObj.setAttribute('data-original', blobUrl)
            } else {
                AObj.setAttribute('data-original', blobUrl)
            }
        }
        
       
    }
    oReq.send();
}

function repairUrl(url) {
    if (url.length === 67) {
        return `/${url}`;
    }
    if (url.length === 66) {
        return `//${url}`;
    }
    return url
}

function parseDataOriginal() {
    let originals = document.querySelector("*[data-original]");
    if (!originals) {
        originals = 0;
    }
    let url = '';
    for (let i = 0; i < originals.length; i++) {
        let originalsItem = originals[i];
        let original = originalsItem.getAttribute('data-original');
        if (original !== null && original.indexOf('/img/parse?resources=') > 0) {
            if (original.split(':')[1]) {
                url = original.split(':')[1];
            } else {
                url = original
            }
            sendA(originalsItem, url, true);
        }
    }
}



parseDataOriginal();
parseAElement();
parseImgElement();
parseDivElement();




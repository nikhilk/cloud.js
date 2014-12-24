var qr = require('qr-image');

var image = qr.image(request.params.text || 'I love QR!');
image.mimeType = 'image/png';

return image;

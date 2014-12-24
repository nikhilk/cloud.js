var qr = require('qr-image');

var image = qr.image(request.params.text || this.app.settings.greeting);
image.mimeType = 'image/png';

return image;

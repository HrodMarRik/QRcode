document.getElementById('generateBtn').addEventListener('click', function() {
    const url = document.getElementById('url').value || 'https://example.com'; // URL par défaut
    const squareColor = document.getElementById('squareColor').value || '#000000'; // Couleur carré par défaut
    const pixelColor = document.getElementById('pixelColor').value || '#FFFFFF'; // Couleur pixel par défaut

    // Récupération de l'image
    const imageFile = document.getElementById('image').files[0];
    let imageSrc = '';
    if (imageFile) {
        imageSrc = URL.createObjectURL(imageFile);
    }

    // Création du QR code personnalisé
    generateCustomQRCode(url, imageSrc, squareColor, pixelColor);
});

// Fonction pour générer le QR code personnalisé
function generateCustomQRCode(text, imageSrc, squareColor, pixelColor) {
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();

    const qrCodeSize = qr.getModuleCount() * 2; // Ajustement de la taille
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = qrCodeSize;
    const context = canvas.getContext('2d');

    // Détermine les zones des trois carrés de positionnement
    const positioningSquares = [
        { x: 0, y: 0 }, // En haut à gauche
        { x: qr.getModuleCount() - 7, y: 0 }, // En haut à droite
        { x: 0, y: qr.getModuleCount() - 7 } // En bas à gauche
    ];

    // Dessin des pixels du QR code
    for (let row = 0; row < qr.getModuleCount(); row++) {
        for (let col = 0; col < qr.getModuleCount(); col++) {
            // Vérifie si le pixel est dans l'un des carrés de positionnement
            const isInPositioningSquare = positioningSquares.some(square => 
                col >= square.x && col < square.x + 7 && row >= square.y && row < square.y + 7
            );

            if (isInPositioningSquare) {
                // Détermine si le pixel est à la bordure du carré de positionnement
                const isBorder = positioningSquares.some(square => 
                    (col === square.x || col === square.x + 6 || row === square.y || row === square.y + 6) &&
                    (col >= square.x && col < square.x + 7 && row >= square.y && row < square.y + 7)
                );

                context.fillStyle = isBorder ? squareColor : '#FFFFFF';
            } else {
                // Pour les autres pixels du QR code
                context.fillStyle = qr.isDark(row, col) ? pixelColor : '#FFFFFF';
            }

            context.fillRect(col * 2, row * 2, 2, 2);
        }
    }

    // Suite du code pour l'ajout de l'image...
    const imageMargin = qrCodeSize / 15; 
    const imageSize = qrCodeSize / 3; 

    if (imageSrc) {
        const image = new Image();
        image.onload = function() {
            context.fillStyle = '#FFFFFF'; // Fond pour l'espace autour de l'image
            const imageStartX = (qrCodeSize - imageSize) / 2;
            const imageStartY = (qrCodeSize - imageSize) / 2;
            context.fillRect(imageStartX, imageStartY, imageSize, imageSize);

            // Dessin de l'image centrale
            context.drawImage(image, imageStartX, imageStartY, imageSize, imageSize);

            document.getElementById('qrcode').innerHTML = '';
            document.getElementById('qrcode').appendChild(canvas);
        };
        image.src = imageSrc;
    } else {
        document.getElementById('qrcode').innerHTML = '';
        document.getElementById('qrcode').appendChild(canvas);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const uploadInput = document.getElementById('upload');
    const imageElement = document.getElementById('image');
    const modal = document.getElementById('cropperModal');
    const cancelButton = document.getElementById('cancelCrop');
    const saveButton = document.getElementById('saveCrop');
    const downloadLink = document.getElementById('downloadLinkLowRes');
    const shareButton = document.getElementById('shareInstagram');
    const toast = document.getElementById('toast');
    let cropper;
    let imageUploaded = false;

    uploadInput.addEventListener('change', function (event) {
        const files = event.target.files;
        const done = (url) => {
            imageElement.src = url;
            modal.style.display = 'block';
            cropper = new Cropper(imageElement, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1,
            });
        };
        let reader;
        let file;
        if (files && files.length > 0) {
            file = files[0];
            if (file.type.startsWith('image/')) {
                reader = new FileReader();
                reader.onload = (e) => {
                    done(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                showToast('File format tidak didukung!');
            }
        }
    });

    document.getElementById('cancelCrop').addEventListener('click', function () {
        modal.style.display = 'none';
        uploadInput.value = '';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    });

    saveButton.addEventListener('click', function () {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas({
                width: 1080,
                height: 1080,
            });
            const twibbonCanvas = document.getElementById('twibbonCanvas');
            const context = twibbonCanvas.getContext('2d');
            const twibbonImage = new Image();
            twibbonImage.src = 'assets/twibbon.png';
            twibbonImage.onload = function () {
                twibbonCanvas.width = 1080;
                twibbonCanvas.height = 1080;
                context.clearRect(0, 0, twibbonCanvas.width, twibbonCanvas.height);
                context.drawImage(canvas, 0, 0, 1080, 1080);
                context.drawImage(twibbonImage, 0, 0, 1080, 1080);
                document.getElementById('downloadLinkLowRes').href = twibbonCanvas.toDataURL('image/png');
            };
        }
        modal.style.display = 'none';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    });

    document.getElementById('copyCaption').addEventListener('click', function () {
        const caption = document.getElementById('caption');
        caption.select();
        document.execCommand('copy');
        showToast('Caption berhasil disalin ke clipboard!');
    });

    document.getElementById('shareInstagram').addEventListener('click', function () {
        let countdown = 5;
        const interval = setInterval(() => {
            showToast(`Silahkan upload secara manual di instagram! Menuju Instagram pada ${countdown}`);
            countdown--;
            if (countdown < 0) {
                clearInterval(interval);
                window.location.href = 'https://www.instagram.com';
            }
        }, 1000);
    });

    function showToast(message) {
        toast.textContent = message;
        toast.className = "show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 6000);
    }
});

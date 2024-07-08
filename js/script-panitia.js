document.addEventListener('DOMContentLoaded', function () {
    const uploadInput = document.getElementById('upload');
    const imageElement = document.getElementById('image');
    const modal = document.getElementById('cropperModal');
    const cancelButton = document.getElementById('cancelCrop');
    const saveButton = document.getElementById('saveCrop');
    const downloadLink = document.getElementById('downloadLinkLowRes');
    const shareButton = document.getElementById('shareInstagram');
    const toast = document.getElementById('toast');
    const fullNameInput = document.getElementById('fullName');
    const classAndMajorInput = document.getElementById('classAndMajor');
    const captionTextarea = document.getElementById('caption');
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
            twibbonImage.src = '/assets/twibbon-panitia.png';
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

    shareButton.addEventListener('click', function () {
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

    function getCustomizedCaption() {
        const fullName = fullNameInput.value || '(Nama lengkap)';
        const classAndMajor = classAndMajorInput.value || '(kelas dan jurusan)';
        return `🚀 𝐈'𝐌 𝐑𝐄𝐀𝐃𝐘 𝐅𝐎𝐑 𝐌𝐏𝐋𝐒 𝐒𝐌𝐊𝐍 𝟐 𝐃𝐄𝐏𝐎𝐊 𝟐𝟎𝟐𝟒 ✨

"𝐊𝐧𝐨𝐰𝐥𝐞𝐝𝐠𝐞 𝐢𝐬 𝐩𝐨𝐰𝐞𝐫 𝐚𝐧𝐝 𝐩𝐨𝐰𝐞𝐫 𝐢𝐬 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫"
Pengetahuan adalah kekuatan dan kekuatan adalah karakter       

𝐇𝐚𝐥𝐨𝐨 𝐤𝐚𝐰𝐚𝐧! 👋🤩
Saya ${fullName} dari ${classAndMajor}. Saya siap mengikuti masa pengenalan lingkungan sekolah dan menjadi bagian dari SMK Negeri 2 Depok Sleman yang mewujudkan generasi berpengetahuan, kuat, dan berkarakter.
               
Untuk informasi lebih lanjut kunjungi Instagram resmi:
@infompls.smkn2depoksleman
@smkn2depoksleman.official
@osis.stembayo
@pkstembayo
@humtik.stembayo            
Hashtags:
#MPLSStembayo #MPLS2024 #MasaPengenalanLingkunganSekolah #Stembayo #SMKN2DepokSleman #ProudToBeSTEMBAYO`;
    }

    document.getElementById('copyCaption').addEventListener('click', function () {
        const captionText = getCustomizedCaption();
        navigator.clipboard.writeText(captionText).then(() => {
            showToast('Caption berhasil disalin ke clipboard!');
        });
    });

    function showToast(message) {
        toast.textContent = message;
        toast.className = "show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 6000);
    }

    fullNameInput.addEventListener('input', updateCaption);
    classAndMajorInput.addEventListener('input', updateCaption);
    function updateCaption() {
        captionTextarea.value = getCustomizedCaption();
    }
});
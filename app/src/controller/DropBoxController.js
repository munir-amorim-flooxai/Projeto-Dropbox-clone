class DropBoxController {

    constructor() {
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.namefileEl = this.snackModalEl.querySelector('.filename');
        this.timeleftEl = this.snackModalEl.querySelector('.timeleft');

        this.initEvents();
    }

    initEvents() {
        this.btnSendFileEl.addEventListener('click', event => {
            this.inputFilesEl.click();
        });

        this.inputFilesEl.addEventListener('change', event => {
            this.uploadFiles(event.target.files);
            this.modalShow();
        });
    }

    modalShow(show = true) {
        this.snackModalEl.style.display = show ? 'block' : 'none';
    }

    uploadFiles(files) {
        let promises = [];

        [...files].forEach(file => {
            promises.push(new Promise((resolve, reject) => {
                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {
                    this.modalShow(false);
                    resolve(event.target.responseText);
                };

                ajax.onerror = event => {
                    this.modalShow(false);
                    reject(event);
                };

                ajax.upload.onprogress = event => {
                    this.uploadProgress(event, file);
                };

                let formData = new FormData();
                formData.append('file', file);

                this.startUploadTime = Date.now();

                ajax.send(formData);
            }));
        });

        return Promise.all(promises);
    }

    uploadProgress(event, file) {
        let timeSpent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let percent = parseInt((loaded / total) * 100);
        let timeLeft = ((100 - percent) * timeSpent) / percent;

        this.progressBarEl.style.width = `${percent}%`;
        this.namefileEl.innerHTML = file.name;
        this.timeleftEl.innerHTML = this.formatTimeToHuman(timeLeft);
    }

    formatTimeToHuman(duration) {
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }

        if (minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos`;
        }

        if (seconds > 0) {
            return `${seconds} segundos`;
        }

        return '';
    }
}

class Modal extends HTMLElement {
    constructor(templateId) {
        super();

        this.isOpen = false;
        this.modal = null;
        
        this.templateId = templateId;
        this.parent = document.getElementById("gmal__app");
    }

    close() {
        this.isOpen = false;
        this.parent.removeChild(this.modal);
    }

    open(popupTitle) {
        this.isOpen = true;

        const template = document.getElementById(this.templateId);
        this.parent.appendChild(template.content.cloneNode(true));
        this.modal = document.getElementById(this.templateId + "_modal");

        this.modal.addEventListener("click", (e) => {
            if (this.isOpen && !e.dontCloseModal) this.close();
        });

        this.modal.querySelector("#popup").addEventListener("click", (e) => {
            e.dontCloseModal = true;
        });

        if (popupTitle) {
            this.modal.querySelector("#popup__title").innerText = popupTitle;
        }

        this.modal.querySelector("#popup__close").addEventListener("click", () => this.close());
    }
}

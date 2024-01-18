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

    open() {
        this.isOpen = true;

        const template = document.getElementById(this.templateId);
        this.parent.appendChild(template.content.cloneNode(true));
        this.modal = document.getElementById("modal__background");

        this.modal.addEventListener("click", (e) => {
            if (this.isOpen && !e.dontCloseModal) this.close();
        });

        document.getElementById("popup").addEventListener("click", (e) => {
            e.dontCloseModal = true;
        });

        document.getElementById("popup__close").addEventListener("click", () => this.close());
    }
}
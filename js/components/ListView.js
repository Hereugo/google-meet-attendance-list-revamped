class ListView extends Modal {
    constructor() {
        super("gmal__list");
    }

    open() {
        super.open();

        // TODO Fill in the popup content
        // document.getElementById("popup__content");

        console.log("Open list view");
    }

    connectedCallback() {
        const btn = Utils.createElement("button", null, "List View");
        this.appendChild(btn);

        btn.addEventListener("click", (e) => {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
            e.stopPropagation();
        });
    }
}

window.customElements.define("gmal-list", ListView);
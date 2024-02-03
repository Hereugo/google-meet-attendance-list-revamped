
class TagContainer extends HTMLElement {
    constructor() {
        super();

        this.tags = [];
    }

    clear() {
        let tags = this.querySelectorAll('.gmal__tag');
        for (let i = 0; i < tags.length; i++) {
            this.removeChild(tags[i]);
        }
    }

    update() {
        this.clear();

        this.tags.toReversed().forEach((tagName, i) => {
            const tag = Utils.createElement("div", null, "gmal__tag");
            
            Utils.addChild(tag, "span", null, null, tagName || "empty"); 
            Utils.addChild(tag, "i", null, "far fa-fw fa-times-circle");
            
            tag.addEventListener("click", (e) => {
                // Since looping through tags array we reverse it to properly put.
                let pos = this.tags.length - i - 1;
                this.tags = [...this.tags.slice(0, pos), ...this.tags.slice(pos + 1)];
                this.update();

                e.stopPropagation();
            });

            this.prepend(tag);
        });
    }

    addTags(tagNames) {
        this.tags = [...this.tags, ...tagNames];
        this.update();
    }

    addTagsInput(e) {
        e.stopPropagation();

        if (e.key !== 'Enter') {
            return;
        }

        this.addTags(e.target.value.split(','));

        this.input.value = "";
        return;
    }

    setFocus(_e) {
        this.input.focus();
    }

    connectedCallback() {
        this.input = Utils.createElement("input", null, null, null, null, { type: "text", placeholder: "Enter names" });
        this.input.addEventListener("keyup", this.addTagsInput.bind(this));

        this.clear();
        this.appendChild(this.input);
        this.addEventListener("click", this.setFocus.bind(this));
    }
}

window.customElements.define("tag-container", TagContainer);

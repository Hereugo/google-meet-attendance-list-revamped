function injectTemplates() {
    document.body.insertAdjacentHTML('beforebegin', `
    <template id="gmal__list">
        <div id="modal__background">
            <div id="popup">
                <button id="popup__close"><svg-icon name="close-big"></svg-icon></button>
                <div id="popup__content">
                    <p>List view</p>
                </div>
            </div>
        </div>
    </template>
    <template id="gmal__detail">
        <div id="modal__background">
            <div id="popup">
                <button id="popup__close"><svg-icon name="close-big"></svg-icon></button>
                <div id="popup__content">
                    <p>Detail view</p>
                </div> 
            </div>
        </div>
    </template>
    `);
}

function setupDOM() {
    document.body.prepend(Utils.createElement(
        "div",
        "gmal__app",
    ));
    injectTemplates();

    // setup a button in google meet tools to open gmal__list
    Utils.onReady(
        ".crqnQb",
        ".tMdQNe",
        () => {
            document.querySelector(".tMdQNe").prepend(Utils.createElement(
                "gmal-list",
            ));
        }
    );
}

function setupDOM() {
    document.body.prepend(Utils.createElement(
        "div",
        "gmal__app",
    ));

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

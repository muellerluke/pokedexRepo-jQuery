var pokemonRepository = (function () {
  var pokemonList = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function addListItem(pokemon) {
    var list = $(".pokemon-list");
    var listItem = $("<li></li>");
    var button = $(
      "<button class='list-item-button'>" + pokemon.name + "</button>"
    );
    listItem.append(button);
    list.append(listItem);
    //When you click on a pokemon...
    button.on("click", () => showDetails(pokemon));
  }
  //add pokemon to the pokemonList
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  //get all pokemon from the list
  function getAll() {
    return pokemonList;
  }

  //load pokemon from the api
  function loadList() {
    return $.ajax({ url: apiUrl, dataType: "json" })
      .then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  // when clicked on, load details from the api about the pokemon
  function loadDetails(item) {
    var detailsUrl = item.detailsUrl;
    return $.ajax({ url: detailsUrl, dataType: "json" })
      .then(function (details) {
        // Now we add the details to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;

        item.types = [];
        details.types.forEach(function (itemType) {
          item.types.push(itemType.type.name);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //show the loaded details about the pokemon
  function showDetails(item) {
    loadDetails(item).then(function () {
      showModal(item);
    });
  }

  function showModal(item) {
    var modalContainer = $("#modal-container");

    modalContainer.empty();

    var modal = $("<div class='modal'></div>");

    var closeButtonElement = $("<button class='modal-close'>Close</button>");
    closeButtonElement.on("click", hideModal);

    var titleElement = $("<h1>" + item.name + "</h1>");

    var imgElement = $("<img src='" + item.imageUrl + "'>");

    var contentElement = $(
      "<p>" +
        item.name +
        "'s height: " +
        item.height +
        "     Types: " +
        item.types +
        "</p>"
    );

    modal.append(closeButtonElement);
    modal.append(titleElement);
    modal.append(imgElement);
    modal.append(contentElement);
    modalContainer.append(modal);

    modalContainer.addClass("is-visible");

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalContainer.hasClass("is-visible")) {
        hideModal();
      }
    });

    modalContainer.on("click", (e) => {
      var target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });
  }

  function hideModal() {
    var modalContainer = $("#modal-container");
    modalContainer.removeClass("is-visible");
  }

  return {
    addListItem: addListItem,
    add: add,
    getAll: getAll,
    loadDetails: loadDetails,
    loadList: loadList,
  };
})();

pokemonRepository.loadList().then(function () {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

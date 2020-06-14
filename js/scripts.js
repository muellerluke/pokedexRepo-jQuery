var pokemonRepository = (function () {
  var pokemonList = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function addListItem(pokemon) {
    var list = $(".list-group");
    var listItem = $("<li class='list-group-item'></li>");
    var button = $(
      "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#exampleModal'>" +
        pokemon.name +
        "</button>"
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
      var modalBody = $(".modal-body");
      modalBody.empty();
      var title = $(".modal-title");
      $(title).text(item.name);

      var img = $("<img src='" + item.imageUrl + "'>");
      var details = $(
        "<p>Height: " + item.height + "       Types: " + item.types + "</p>"
      );

      modalBody.append(img);
      modalBody.append(details);
    });
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

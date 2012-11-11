(function () {
  "use strict";

  // master global
  var global = this;

  function game_link_exists() {
    return "game" in get_hash_params();
  }

  // public API
  global.flow_adapter = {
    init: function () {
      // console.log("[game] flow_adapter.init");

      var user_id = pklib.cookie.get("user_id");

      if (user_id !== null) {
        // JEST COOKIE
        socket.emit('player-login', user_id);
        console.log("COMMAND player-login", user_id);

        flow_adapter._game_flow();
      } else {
        // NIE MA COOKIE
        // pokazujemy panel logowania
        flow_adapter._login_flow();
      }
    },

    submit_login_form: function (name) {
      // console.log("[game] flow_adapter.submit_login_form");

      pklib.cookie.create("user_name", name);

      socket.emit("player-create", name);
      console.log("COMMAND: player-create: " + name);
    },

    _game_flow: function () {
      if (game_link_exists()) {
        // TAK

        var game_id = get_hash_params("game");
        socket.emit("game-join", game_id);
        console.log("COMMAND game-join", game_id);
      } else {
        // NIE

        socket.emit('game-create');
        console.log("COMMAND: game-create");
      }
    },

    _login_flow: function () {
      var submit = $(".login-form .submit"),
        name = $(".name");

      // keypress - > active submit
      name.keyup(function () {
        var _T = $(this);

        if (_T.val().length) {
          submit.removeClass("disabled");
        } else {
          submit.addClass("disabled");
        }
      });

      $(".login-form form").submit(function (evt) {
        if (Config.env === "production") {
          alert("Wypierdalaj " + name.val() + "!");
        } else {
          flow_adapter.submit_login_form(name.val());
        }

        evt.preventDefault();
      });
    }
  };

  $(function () {
    flow_adapter.init();

    $(".new-game").on("click", function () {
      // czyscimy cookie
      pklib.cookie.remove("user_name");
      pklib.cookie.remove("user_id");
      // redirect do glownej strony
      var protocol = document.location.protocol;
      var host = document.location.host;
      var url = protocol + "//" + host;
      document.location = url;
    })
  });
}).call(this);
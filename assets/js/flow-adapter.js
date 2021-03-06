(function () {
  "use strict";

  // master scope
  var global = this;

  function game_link_exists() {
    return "game" in get_hash_params();
  }

  // public API
  global.flow_adapter = {
    init: function () {
      console.log("[game] flow_adapter.init");

      var user_id = pklib.cookie.get("user_id");

      if (user_id !== null) {
        // JEST COOKIE
        socket.on("player-loged", function () {
          flow_adapter._game_flow();
        });

        socket.emit('player-login', user_id);
        console.log("COMMAND: player-login \"" + user_id + "\"");
      } else {
        // NIE MA COOKIE
        // pokazujemy panel logowania
        flow_adapter._login_flow();
      }
    },

    submit_login_form: function (name) {
      console.log("[game] flow_adapter.submit_login_form");

      pklib.cookie.create("user_name", name);

      socket.emit("player-create", name);
      console.log("COMMAND: player-create \"" + name + "\"");
    },

    _game_flow: function () {
      console.log("[game] flow_adapter._game_flow");

      if (game_link_exists()) {
        // TAK
        var game_id = get_hash_params("game");
        trailer.GAME_ID = game_id;

        socket.emit("game-join", game_id);
        console.log("COMMAND: game-join \"" + game_id + "\"");
      } else {
        // NIE
        socket.emit('game-create');
        console.log("COMMAND: game-create");
      }
    },

    _login_flow: function () {
      console.log("[game] flow_adapter._login_flow");

      // show login screen
      screen_manager.show_screen("screen-hello");

      var submit = $(".login-form .submit"),
        name = $(".name");

      // keypress -> active submit
      name.on("keyup blur click", function () {
        var trim_name = pklib.string.trim($(this).val());
        if (trim_name.length) {
          submit.removeClass("disabled");
        } else {
          submit.addClass("disabled");
        }
      });

      // ustawiamy focus aby user mogl od razu wpisac swoj nick
      $(".login-form #login").focus();

      // przechwytujemy akcje wyslania forma
      $(".login-form form").submit(function (evt) {
        var trim_name = pklib.string.trim(name.val());
        if (!submit.hasClass("disabled")) {
          flow_adapter.submit_login_form(trim_name);
          submit.addClass("disabled");
        }

        evt.preventDefault();
      });
    }
  };
}).call(this);
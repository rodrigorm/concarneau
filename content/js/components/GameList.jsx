'use strict';

var GameList = React.createClass({
    render: function render() {
        return (
            <div id="list-games">
                <div id="active-games">
                    <div className="menu-sub-header">Your move:</div>
                    {this.renderActiveGames()}
                </div>
                <div id="inactive-games">
                    <div className="menu-sub-header">Waiting on move:</div>
                    {this.renderInactiveGames()}
                </div>
                <div id="finished-games">
                    <div className="menu-sub-header">Finished:</div>
                    {this.renderFinishedGames()}
                </div>
            </div>
        );
    },

    renderFinishedGames: function renderFinishedGames() {
        return this.props.games
            .filter(function(game) {
                return game.finished;
            })
            .map(function (game) {
                return this.renderGameListingItem(game);
            }.bind(this));
    },

    renderActiveGames: function renderActiveGames() {
        return this.props.games
            .filter(this.isActiveGame)
            .map(function (game) {
                return this.renderGameListingItem(game);
            }.bind(this));
    },

    renderInactiveGames: function renderInactiveGames() {
        return this.props.games
            .filter(this.isInactiveGame)
            .map(function (game) {
                return this.renderGameListingItem(game);
            }.bind(this));
    },

    isInactiveGame: function isInactiveGame(game) {
        return !this.isActiveGame(game);
    },

    isActiveGame: function isActiveGame(game) {
        return !game.finished && game.players.some(function(player) {
            return player.active && player.user._id == this.props.user._id;
        }.bind(this));
    },

    renderGameListingItem: function renderGameListingItem(game) {
		var players = game.players.map(function(item) {
   			return (<div className="game-player-listing">{(item.active ? '<' + item.user.username + '>' : item.user.username)}</div>);
 		});

        return (
		    <div className="menu-game-listing" id={'game-' + game._id} onClick={this.handleClickGame(game)}>
		        <span className="right-side">
                    <span className="tile-count">[{game.unusedTiles.length + (game.finished ? 0 : 1)}]</span>
                    <i className="fa fa-trash-o hidden"></i>
                </span>
                {players}
            </div>
        );

   		$(element).click(function() {
     	  	socket.emit('load game', gameid);
     	  	$('#chat-wrapper').removeClass('hidden');
            $('#menu-checkbox').attr('checked', false);
     	  	currentGameID = gameID;
		}).appendTo(menuGroup);
	},

    handleClickGame: function handleClickGame(game) {
        return function() {
            this.props.onClickGame(game);
        }.bind(this);
    }
});

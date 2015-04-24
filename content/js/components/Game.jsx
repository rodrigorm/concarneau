'use strict';

var Game = React.createClass({
    getDefaultProps: function getDefaultProps() {
        return {
            width: 100
        }
    },

    componentDidMount: function componentDidMount() {
        this.refs.sendMoveButtonIcon.getDOMNode().setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#svgicon-transfer');
        this.refs.confirmButtonIcon.getDOMNode().setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#svgicon-selecting-from-list');
    },

    handleClickSendMoveButton: function handleClickSendMoveButton() {
        this.props.onSendMove(this.state.selectedMove);
    },

    handleClickConfirmButton: function handleClickConfirmButton() {
        this.props.onConfirmMove();
    },

    handleMeepleClick: function handleMeepleClick() {
        // if the meeple on the first row is clicked move into normal meeple placement mode
    },

    handleClickValidPlacement: function handleClickValidPlacement() {
    },

    userIsActive: function userIsActive() {
        return this.props.game.players.some(function(player) {
            return player.user._id == this.props.userID && player.active;
        }.bind(this));
    },

    render: function render() {
        return (
            <g>
                <g id="game-area">
                    <g id="placed-tile-images">{this.renderPlacedTileImages()}</g>
                    <g id="placed-tile-pieces">{this.renderPlacedTiles()}</g>
                    <g id="turn-markers">{this.renderTurnMarkers()}</g>
                    <g id="valid-placements">{this.renderValidPlacements()}</g>
                    <g id="active-tile">{this.renderActiveTile()}</g>
                </g>
                <g id="ui-area">
                    <g id="score-area">
                        <rect id="score-bg" rx={15} ry={15} x={-15} y={-15} fill="white" stroke="black" strokeWidth={2} opacity={0.75} height={tileSize / 4 + this.props.game.players.length * (tileSize / 2 - 5)} width={5 + 6 * (tileSize / 4.75) + tileSize / 4 + 20} opacity={.75} />
                        {this.renderScoreGroups()}
                    </g>
                    <g id="send-move-button" cursor="pointer" visibility="hidden" onClick={this.handleClickSendMoveButton}>
                        <circle cy={5 + tileSize / 2} cx={this.props.gameWidth - 5 - tileSize / 2} r={30} fill="green" stroke="black" strokeWidth={5} />
                        <use ref="sendMoveButtonIcon" x={this.props.gameWidth - 5 - tileSize / 2 - 16} y={5 + tileSize / 2 - 16} />
                    </g>
                    <g id="confirm-button" cursor="pointer" visibility="hidden" onClick={this.handleClickConfirmButton}>
                        <circle cy={5 + tileSize / 2} cx={this.props.gameWidth - 5 - tileSize / 2} r={30} fill="green" stroke="black" strokeWidth={5} />
                        <use ref="confirmButtonIcon" x={this.props.gameWidth - 5 - tileSize / 2 - 16} y={5 + tileSize / 2 - 16} />
                    </g>
                </g>
            </g>
        );
    },

    renderPlacedTileImages: function renderPlacedTileImages() {
        return this.props.game.placedTiles.map(this.renderPlacedTileImage);
    },

    renderPlacedTileImage: function renderPlacedTileImage(tile) {
        return (<Image className="placed-tile-image" src={tile.tile.imageURL} x={0} y={0} width={tileSize} height={tileSize} transform={'rotate(' + 90 * tile.rotation + ',' + ((this.props.gameWidth / 2 + tile.x * tileSize) + tileSize / 2) + ',' + ((this.props.gameHeight / 2 + tile.y * tileSize) + tileSize / 2) + ') translate(' + (this.props.gameWidth / 2 + tile.x * tileSize) + ',' + (this.props.gameHeight / 2 + tile.y * tileSize) + ')'} />);
    },

    renderPlacedTiles: function renderPlacedTiles() {
        return this.props.game.placedTiles.map(this.renderPlacedTile);
    },

    renderPlacedTile: function renderPlacedTile(tile) {
        var meepleImages = tile.meeples.map(function(item) {
            return {
                color: this.props.game.players[item.playerIndex].color,
                rotation: tile.rotation,
                location: item.placement.locationType,
                meepleType: item.meepleType,
                meepleOffset:
                    item.placement.locationType === 'cloister' ?
                        { x: 1/2, y: 1/2 } :
                    item.placement.locationType === 'city' ?
                        tile.tile['cities'][item.placement.index].meepleOffset :
                        tile.tile[item.placement.locationType + 's'][item.placement.index].meepleOffset
            };
    	}.bind(this)).map(function(item) {
            return (
                <Image className="meeple" width={item.meepleType !== 'normal' ? tileSize * 3 / 8 : tileSize / 4} height={item.meepleType !== 'normal'  ? tileSize * 3 / 8 : tileSize / 4} x={tileSize * item.meepleOffset.x - (item.meepleType !== 'normal'  ? tileSize * 3 / 8 : tileSize / 4) / 2} y={tileSize * item.meepleOffset.y - (item.meepleType !== 'normal'  ? tileSize * 3 / 8 : tileSize / 4) / 2} src={'/content/images/meeples/' + item.color + '_' + (item.meepleType !== 'normal' && item.meepleType !== 'large' ? item.meepleType : (item.location === 'farm' ? 'lying' : 'standing')) +'.png'} transform={'rotate(' + item.rotation * -90 + ',' + item.meepleOffset.x * tileSize + ',' + item.meepleOffset.y * tileSize + ')'} />
            );
        });

        var placedTileTowerOutlines = null;
        var placedTileTowerPlacements = null;

        var placedTileTowers = (function() {
        	if(!tile.tower) {
        		return [];
        	}
        	var towerData = [];
        	for(var i = 0; i < tile.tower.height; i++) {
        		towerData.push({
        			offset: tile.tile.tower.offset,
        			tileRotation: tile.rotation,
        			towerHeight: i
        		});
        	}
        	return towerData;
        }()).map(function(item) {
            return (
                <Image className="tower" width={tileSize / 3} height={tileSize / 3} src="/content/images/meeples/tower.png" x={item.offset.x * tileSize - tileSize / 6} y={item.offset.y * tileSize - tileSize / 6 - towerVerticalSize * item.towerHeight} transform={'rotate(' + item.tileRotation * -90 + ',' + item.offset.x * tileSize + ',' + item.offset.y * tileSize + ')'} />
            );
        });

        var placedTileTowerOutlines = (function() {
        	if(!tile.tile.tower || tile.tower.completed) {
        		return [];
        	}
    		return [{
    			offset: tile.tile.tower.offset,
    			tileRotation: tile.rotation,
    			tileIndex: i,
    			towerHeight: tile.tower.height
    		}];
        }()).map(this.renderTowerOutline);

        var placedTileTowerPlacements = (function() {
        	if(!tile.tile.tower || tile.tower.completed) {
        		return [];
        	}
    		return [{
    			offset: tile.tile.tower.offset,
    			tileRotation: tile.rotation,
    			tileIndex: i,
    			towerHeight: tile.tower.height
    		}];
        }()).map(function(item) {
            return (
                <Image className="placed-tower" width={tileSize / 3} height={tileSize / 3} src="/content/images/meeples/tower.png" x={item.offset.x * tileSize - tileSize / 6} y={item.offset.y * tileSize - tileSize / 6 - towerVerticalSize * item.towerHeight} transform={'rotate(' + item.tileRotation * -90 + ',' + item.offset.x * tileSize + ',' + item.offset.y * tileSize + ')'} visibility="hidden" />
            );
        });

        return (
            <g className="placed-tile" transform={'rotate(' + 90 * tile.rotation + ',' + ((this.props.gameWidth / 2 + tile.x * tileSize) + tileSize / 2) + ',' + ((this.props.gameHeight / 2 + tile.y * tileSize) + tileSize / 2) + ') translate(' + (this.props.gameWidth / 2 + tile.x * tileSize) + ',' + (this.props.gameHeight / 2 + tile.y * tileSize) + ')'}>
                <g className="tower-pieces">{placedTileTowers}</g>
                {meepleImages}
                {placedTileTowerOutlines}
                {placedTileTowerPlacements}
            </g>
        );
    },

    renderTowerOutline: function renderTowerOutline(item) {
        return (
            <Image className="tower-outline" width={tileSize / 3} height={tileSize / 3} src="/content/images/meeples/outline_tower.png" visibility="hidden" onClick={this.handleClickTowerOutline} x={item.offset.x * tileSize - tileSize / 6} y={item.offset.y * tileSize - tileSize / 6 - towerVerticalSize * item.towerHeight} transform={'rotate(' + item.tileRotation * -90 + ',' + item.offset.x * tileSize + ',' + item.offset.y * tileSize + ')'} />
        );
    },

    renderTurnMarkers: function renderTurnMarkers() {
		// draw outlines indicating the last tile each player placed
		var markers = [];
		var markedPlayers = [];
		// move backwards through the tiles creating a marker for each tile placed (until every player has at least one)
		// for each tile placed assign x and y of the tile and color of the placing player
		var k = this.props.game.placedTiles.length - 1;
		while(k > 0 && markedPlayers.length < this.props.game.players.length) {
			if(markedPlayers.indexOf(this.props.game.placedTiles[k].playerIndex) === -1) {
				markedPlayers.push(this.props.game.placedTiles[k].playerIndex);
			}
			markers.push({
				x: this.props.game.placedTiles[k].x,
				y: this.props.game.placedTiles[k].y,
				color: this.props.game.players[this.props.game.placedTiles[k].playerIndex].color
			});
			k--;
		}

		return markers.map(function(marker) {
            return(
                <rect className="turn-marker" fillOpacity={0} strokeWidth={4} strokeLinejoin="round" rx={7} ry={7} width={tileSize} height={tileSize} x={this.props.gameWidth / 2 + marker.x * tileSize} y={this.props.gameHeight / 2 + marker.y * tileSize} stroke={marker.color} />
            );
        }.bind(this));
    },

    renderValidPlacements: function renderValidPlacements() {
        if (!this.userIsActive()) {
            return null;
        }

		// draw the places where the active tile can be placed
        return this.props.game.activeTile.validPlacements.map(function(validPlacement, i) {
		    return (
                <Image className="tile-placements" id={'placement-' + i} width={tileSize} height={tileSize} src="/content/images/ui/placement_available.png" x={this.props.gameWidth / 2 + validPlacement.x * tileSize} y={this.props.gameHeight / 2 + validPlacement.y * tileSize} onClick={this.handleClickValidPlacement} />
            );
        }.bind(this));
    },

    renderActiveTile: function renderActiveTile() {
        if (!this.props.game.activeTile.tile) {
            return null;
        }

        return (
            <g id="active-tile-translation" transform={'translate(' + tileSize / 2 + ',' + tileSize / 2 + ')'}>
                <g id="active-tile-rotation">
                    <Image width={tileSize} height={tileSize} id="active-tile-image" pointerEvents="none" x={-tileSize / 2} y={-tileSize / 2} src={this.props.game.activeTile.tile.imageURL} />
                    {this.renderActiveTileTowerOutline()}
                    {this.renderActiveTileTowerPlacement()}
                    <Use id="active-tile-rotation-indicator" src="#svgicon-repeat-payment" x={-16} y={-16} transform={'scale(' + tileSize / 32 + ')'} fill="white" stroke="black" opacity={0} pointerEvents="none" />
                </g>
                <g id="meeple-placements" visibility="hidden">
                </g>
            </g>
        );
    },

    renderActiveTileTowerOutline: function renderActiveTileTowerOutline() {
        if (!this.props.game.activeTile.tile || !this.props.game.activeTile.tile.tower) {
            return null;
        }

        // then draw an outline for tower placement on the active tile
        return this.renderTowerOutline({
            offset: this.props.game.activeTile.tile.tower.offset,
            tileIndex: this.props.game.placedTiles.length,
            tileRotation: 0,
            towerHeight: this.props.game.activeTile.tile.tower.height
        });
    },

    renderActiveTileTowerPlacement: function renderActiveTileTowerPlacement() {
        if(!this.props.game.activeTile.tile || !this.props.game.activeTile.tile.tower) {
            return null;
        }

        return (
            <Image className="placed-tower" width={tileSize / 3} height={tileSize / 3} src="/content/images/meeples/tower.png" x={-tileSize / 6} y={-tileSize / 6} transform={'translate(' + (this.props.game.activeTile.tile.tower.offset.x - 1/2) * tileSize + ',' + (this.props.game.activeTile.tile.tower.offset.y - 1/2) * tileSize + ')'} visibility="hidden" />
        );
    },

    renderScoreGroups: function renderScoreGroups() {
        return this.reorderedPlayers().map(this.renderScoreGroup);
    },

    renderScoreGroup: function renderScoreGroup(player, i) {
        return (
            <g class="score-group" id={'score-group-' + player.color}>
                <text class="point-total" x={5 + 7 * (tileSize / 4.75)} y={5 + tileSize / 8 + i * (tileSize / 2 - 5)} textAnchor="end">
                    {player.points}
                </text>
                <text class="player-name-outline" x={5} y={5 + tileSize / 8 + i * (tileSize / 2 - 5)} textAnchor="start" stroke="black" strokeWidth={2.5}>
                    {player.user.username}
                </text>
                <text class="player-name" x={5} y={5 + tileSize / 8 + i * (tileSize / 2 - 5)} textAnchor="start" fill={(player.color === 'purple') ? 'fuchsia' : ((player.color === 'blue') ? 'royalblue' : player.color)}>
                    {player.user.username}
                </text>
                {this.renderAvailableMeeples(player, i)}
            </g>
        );
    },

    renderAvailableMeeples: function renderAvailableMeeples(player, i) {
        var meeples = [];
        for (var k = 0; k < player.remainingMeeples; k++) {
            meeples.push({
                x: 5 + k * (tileSize / 4.75),
                y: tileSize / 4 - 5 + i * (tileSize / 2 - 5),
                color: player.color,
                row: i
            });
        }
        meeples.reverse();
        return meeples.map(this.renderAvailableMeeple);
    },

    renderAvailableMeeple: function renderAvailableMeeple(meeple) {
        return (<Image className="normal-meeple" src={'/content/images/meeples/' + meeple.color + '_standing.png'} y={meeple.y} width={tileSize / 4} height={tileSize / 4} onClick={meeple.row === 0 ? this.handleMeepleClick : null} x={meeple.x} visibility={null} />);
    },

    reorderedPlayers: function reorderedPlayers() {
		var playerCount = this.props.game.players.length;
		var count = 0;
    	var reorderedPlayers = this.props.game.players.slice(0);
		while(reorderedPlayers[0].user._id !== this.props.userID ||
		      (!reorderedPlayers[0].active && count < playerCount)) {
	      	count++;
			reorderedPlayers.push(reorderedPlayers.shift());
		}

        return reorderedPlayers;
    }
});

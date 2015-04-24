'use strict';

var GameScreen = React.createClass({
    getInitialState: function getInitialState() {
        return {
            socket: io.connect(this.props.socketUrl),
            gameWidth: 0
        };
    },

    componentDidMount: function componentDidMount() {
        this.setState({
            gameWidth: this.refs.svgWrapper.getDOMNode().offsetWidth,
            gameHeight: this.refs.svgWrapper.getDOMNode().offsetHeight
        });
        this.state.socket.on('sending gamestate', this.handleSendingGamestate);
	    this.state.socket.on('game started', this.handleGameStarted);
	    this.state.socket.on('friend added', this.handleFriendAdded);
	    this.state.socket.on('friend not found', this.handleFriendNotFound);
	    this.state.socket.on('message sent', this.handleMessageSent);
        this.loadSvgIcons();
    },

    handleSendingGamestate: function handleSendingGamestate(gamestate, loadingGame) {
        this.setState({gamestate: gamestate});
        console.log('handleSendingGamestate', gamestate, loadingGame);
    },

    handleGameStarted: function handleGameStarted(gamestate, startingUserID) {
        console.log('handleGameStarted', gamestate, startingUserID);
    },

    handleFriendAdded: function handleFriendAdded(username, userID) {
        console.log('handleFriendAdded', username, userID);
    },

    handleFriendNotFound: function handleFriendNotFound() {
        console.log('handleFriendNotFound');
    },

    handleMessageSent: function handleMessageSent(message, username, gameID) {
        console.log('handleMessageSent', message, username, gameID);
    },

    handleClickGame: function handleClickGame(game) {
        this.state.socket.emit('load game', game._id);
        this.setState({
            currentGameID: game._id,
            menuOpened: false
        });
    },

    handleSendMove: function handleSendMove(selectedMove) {
        socket.emit('sending move', this.state.currentGameID, selectedMove);
    },

    handleConfirmMove: function handleConfirmMove() {
    },

    loadSvgIcons: function loadSvgIcons() {
        // Load in SVG icons
        var c = new XMLHttpRequest();
        c.open('GET', '/content/images/ui/icons.svg', false);
        c.setRequestHeader('Content-Type', 'text/xml');
        c.send();
        document.body.insertBefore(c.responseXML.firstChild, document.body.firstChild);
    },

    render: function render() {
        return (
            <div id="wrapper">
                <label id="menu-open" htmlFor="menu-checkbox" onclick="openMenu()">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </label>
                <label id="menu-close" htmlFor="menu-checkbox" className="hidden">
                    <i className="fa fa-times"></i>
                </label>
                <label id="menu-overlay" htmlFor="menu-checkbox"></label>
                <div id="menus">
                    <div id="game-menu">
                        <span className="menu-header">GAMES <i className="fa fa-edit hidden" onclick="enableGamesEdit(event)"></i> <i className="fa fa-plus-square-o"></i></span>
                        <GameList user={this.props.user} games={this.props.user.activeGames} onClickGame={this.handleClickGame} />
                    </div>
                    <div id="friends-menu">
                        <span className="menu-header">FRIENDS <i className="fa fa-edit hidden" onclick="enableFriendsEdit(event)"></i></span>
                        <form id="add-friend-form">
                            <div className="input-group">
                                <input type="text" className="form-control" id="add-friend-input" placeholder="Username" autoComplete="off" />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="submit">Add</button>
                                </span>
                            </div>
                        </form>
                        <div id="username-alert" className="alert">Placeholder text</div>
                        <div id="friends-list"></div>
                    </div>
                    <div id="settings-menu">
                        <span className="menu-header">SETTINGS</span>
                        <a href="/profile">Profile</a>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox"
                                    onclick="socket.emit('email notification', this.checked)"
                                    checked={this.props.user.email_notifications ? 'true' : ''}
                                    disabled={!((this.props.user.facebook && this.props.user.facebook.email) || (this.props.user.google && this.props.user.google.email) || (this.props.user.local && this.props.user.local.email)) ? 'true' : ''} />
                                E-mail notifications
                            </label>
                            {!((this.props.user.facebook && this.props.user.facebook.email) || (this.props.user.google && this.props.user.google.email) || (this.props.user.local && this.props.user.local.email)) ? '(requires non-Twitter login linked in Profile)' : ''}
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox"
                                    onclick="socket.emit('twitter notification', this.checked)"
                                    checked={this.props.user.twitter_notifications ? 'true' : ''}
                                    disabled={!(this.props.user.twitter && this.props.user.twitter.username) ? 'true' : ''} />
                                Twitter notifications
                            </label>
                            {!(this.props.user.twitter && this.props.user.twitter.username) ? '(requires Twitter login linked in Profile)' : ''}
                        </div>
                        <a href="/logout">Logout</a>
                    </div>
                </div>
                <div id="menu-selection">
                    <div id="game-menu-selection" className="iconmelon" onclick="menuClick('#game-menu', this)">
                        <svg viewBox="0 0 32 32">
                        </svg>
                    </div>
                    <div id="friends-menu-selection" className="iconmelon" onclick="menuClick('#friends-menu', this)">
                        <svg viewBox="0 0 32 32">
                        </svg>
                    </div>
                    <div id="settings-menu-selection" className="iconmelon" onclick="menuClick('#settings-menu', this)">
                        <svg viewBox="0 0 32 32">
                        </svg>
                    </div>
                </div>
                <div id="author-info">
                    <div>
                        Created by <span id="author-name"><a href={'mailto:' + 'btouellette+concarneau' + '@' + 'gmail.com'}>Brian Ouellette</a></span>
                        <a href="http://github.com/btouellette/concarneau"><img height="25" width="25" src="/content/images/ui/github_logo.png" /></a>
                    </div>
                    <div>
                        <span>Buy me a beer?</span>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="btouellette@gmail.com" />
                            <input type="hidden" name="lc" value="US" />
                            <input type="hidden" name="item_name" value="Concarneau" />
                            <input type="hidden" name="no_note" value="0" />
                            <input type="hidden" name="currency_code" value="USD" />
                            <input type="hidden" name="bn" value="PP-DonationsBF:paypal-icon.png:NonHostedGuest" />
                            <input type="image" height="25" width="25" src="/content/images/ui/paypal_logo.png" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                        </form>
                        <img id="btc-donate" height="25" width="25" src="/content/images/ui/bitcoin_logo.png" />
                    </div>
                    <div>
                        <span>Buy the game?</span>
                        <a href="http://amzn.to/1pd6fg3"><img id="amazon-link" height="25" width="25" src="/content/images/ui/amazon_logo.png" /></a>
                    </div>

                </div>
                <div ref="svgWrapper" id="svg-wrapper">
                    <svg id="game-svg" width="100%" height="100%">
                        <defs>
                            <pattern id="thin-stripes-pattern" width="5" height="5" patternUnits="userSpaceOnUse">
                                <rect width="5" height="5" fill="#f5f5f5"></rect>
                                <path d="M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z" stroke="#e0e0e0"></path>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#thin-stripes-pattern)" id="game-background"></rect>
                        {this.state.gamestate ? <Game game={this.state.gamestate} userID={this.props.user._id} gameWidth={this.state.gameWidth} gameHeight={this.state.gameHeight} onSendMove={this.handleSendMove} onConfirmMove={this.handleConfirmMove} /> : null}
                    </svg>
                </div>
                <div id="chat-wrapper" className="panel panel-primary hidden">
                    <div id="chat-header" className="panel-heading">
                        <div id="chat-header-label"><i className="fa fa-comments"></i><span> Chat</span></div>
                        <div id="chat-toggle" className="btn-group">
                            <a className="btn btn-default btn-xs" onclick="$('#chat-body,#chat-footer').toggle()">
                                <i className="fa fa-chevron-down"></i>
                            </a>
                        </div>
                    </div>
                    <div id="chat-body">
                        <ul id="chat-message-list">
                        </ul>
                    </div>
                    <div id="chat-footer">
                        <form id="chat-message-form">
                            <div className="input-group">
                                <input id="chat-message-input" type="text" className="form-control input-sm" maxLength="200" placeholder="Type your message here..." />
                                <span className="input-group-btn">
                                    <button className="btn btn-sm btn-info" type="submit">Send</button>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

var usersOnline = {};

module.exports = function (socket) {

    console.log('a user connected: ' + socket.id);

    function removeUser(id){
        let roomIdUpdate = null;
        for (var prop in usersOnline) {
            if (usersOnline[prop].filter((x) => x.id == id).length > 0){
                roomIdUpdate = prop;
            }
            usersOnline[prop] = usersOnline[prop].filter((x) => x.id !== id);
            if (usersOnline[prop].length === 0){
                delete usersOnline[prop];
            }
        }
        return roomIdUpdate;        
    }

    function addUser(data, id){
        removeUser(id);
        if(!usersOnline[data.roomId]){
            usersOnline[data.roomId] = [];
        }
        usersOnline[data.roomId].push({
            id: id,
            nickname: data.nickname
        });

    }

    socket.on('disconnect', () => {
        let roomIdUpdate = removeUser(socket.id);
        socket.in(roomIdUpdate).emit('newUser', usersOnline[roomIdUpdate]);
        console.log('user disconnected: '+ socket.id);
        console.log(usersOnline);
        console.log(roomIdUpdate);
    });

    socket.on('openChannel', function (data) {
        socket.join(data.roomId);

        addUser(data, socket.id);

        socket.in(data.roomId).emit('newUser', usersOnline[data.roomId]);
        socket.emit('newUser', usersOnline[data.roomId]);
        console.log(' Client joined the room and client id is ' + socket.id);
        console.log(usersOnline);

    });
    socket.on('registerItem', function (data) {
        if (!data.data.food && !data.data.company && !data.data.car){
            socket.emit('error:registerItem', 'Params not informed to register!');
            console.log('error:' + JSON.stringify(socket.id));
        }else{
            socket.emit('success:registerItem', data);
            socket.in(data.roomId).emit('newItem', data);
        }
        console.log('registerItem:' + JSON.stringify(data));

    })

};
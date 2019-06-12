$("#history").height($(window).height() * 0.86 + "px");
$("#chat").height($(window).height() * 0.1 + "px"); 
$("#content-group").height($("#history").height() * 0.065 + "px") 
$("#conten-message").height($("#history").height() * 0.745 + "px") 

const socket = io.connect('http://localhost:3009', {
    query: {token: localStorage.token}
});

// function for emmit from client

// check if user typing
isTyping = (event) => {
    return !(event.which === 13 || event.keyCode === 13);
};

// send message and append to conversation
sendMessage = () => {
    // emit to server with action "create"
    const myMessage = $(".inputText").val().trim();
    if (myMessage) {
        const data = {
            action: "create",
            message: myMessage
        };
        socket.emit("messages", data, (error, returningData) => {
            if (error) {
                return alert('Somthing error!');
            }   
            
            $("#content-message").append(
            `<div class = "wrap-message-send">
                <div class = "frame-send">${returningData.message}</div>
            </div>`
            );
            $("#seen").hide();
        });
    };
    $(".inputText").val("");
}; 

// typing or send message
$(".inputText").keyup((event) => {
    if(isTyping(event)) {
        let data = {
            action: "typing"
        }
        socket.emit("messages", data);
    } else {
        sendMessage();
    }
});

//stop typing 
$(".inputText").focusout(() => {
    let data = {
        action: "stop-typing"
    }
    socket.emit("messages", data);
});

//seen the other's message 
$(".inputText").focusin(() => {
    let data = {
        action: "seen"
    }
    socket.emit("messages", data);
});


// function listening from server

// check receive message and typing
isFocus = () => {
    return $(".inputText").is(":focus") ;
}

// recieve message from server
recieveMessage = (data) => {
    $("#content-message").append(
        `<div class = "wrap-message-recieve">
            <div class ="frame-recieve">${data.message}</div>
        </div>`
    );
    $("#seen").hide();
    $("#typing").hide();
    if(isFocus()) {
        $(".inputText").focusin((event) => {
            data = {
                action: "seen"
            }
            socket.emit("messages", data);
        });        
    }
}

// functions handle
seenMessage = () => {
    console.log($("#content-message").last().html());
    if ($("#content-message").last().hasClass("wrap-message-send")) {
        alert(0);
        $("#seen").css("display","flex");
    } else {
        alert(1);
    }
};

typingMessage = () => {
    $("#typing").show();
   
};

stopTyping = () => {
    $("#typing").hide();
};


socket.on('messages', (data) => {
    switch(data.action) {
        case "receive": {
            recieveMessage(data);
            break;
        }
        case "typing": {
            typingMessage();
            break
        }
        case "stop-typing": {
            stopTyping();
            break
        }
        case "seen": {
            seenMessage();
            break
        }
    }
});

socket.on('error', function(error) {
    alert('Opps, Some thing error');
    console.log(error);
});







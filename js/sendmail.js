/* SmtpJS.com - v3.0.0 */
var Email = {
    send: function (a) {
        return new Promise(function (n, e) {
            a.nocache = Math.floor(1e6 * Math.random() + 1),
                    a.Action = "Send";
            var t = JSON.stringify(a);
            Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) {
                n(e)
            })
        })
    }, ajaxPost: function (e, n, t) {
        var a = Email.createCORSRequest("POST", e);
        a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
                a.onload = function () {
                    var e = a.responseText;
                    null != t && t(e)
                }, a.send(n)
    }, ajax: function (e, n) {
        var t = Email.createCORSRequest("GET", e);
        t.onload = function () {
            var e = t.responseText;
            null != n && n(e)
        }, t.send()
    }, createCORSRequest: function (e, n) {
        var t = new XMLHttpRequest;
        return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t
    }
};

/*send mail*/
$(document).ready(function () {
    $("#form-mail").validate({// <-- initialize plugin on the form.
        rules: {
            contact_name: {
                required: true
            },
            contact_email: {
                required: true,
                email: "Introduce una dirección de correo válida",
            },
            contact_msj: {
                required: true
            }

        },
        messages: {
            contact_name: getMsg("#contact_name"),
            contact_email: getMsg("#contact_email"),
            contact_msj: getMsg("#contact_msj")
        }
    });


    $('body').on('click', '#enviar', function (e) {
        e.preventDefault();
        if ($("#form-mail").valid()) {
            precarga('1');

            //Obtener y formatear fecha actual
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var output = d.getFullYear() + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + (('' + day).length < 2 ? '0' : '') + day;
            var date = new Date(output);
            var fecha = date.toLocaleDateString("fr-FR"); //fr-FR: dd/mm/yyyy;

            name = $("#contact_name").val();
            email = $("#contact_email").val().toLowerCase();
            msj = $("#contact_msj").val();

            Email.send({
                Host: "smtp.elasticemail.com",
                Username: "ups923@gmail.com",
                Password: "94EF9BCA60E6C65F4FCF4D51C4FBCF928859",
                To: 'ups923@gmail.com',
                From: "ups923@gmail.com",
                Subject: fecha + " | Email Recibido de GitHub",
                Body: "Has recibido un email desde la plataforma GitHub: <br/> \
                <b>Nombre:</b>  " + name + " <br/> \n\
                <b>Email:</b>   " + email + " <br/> \n\
                <b><br/>Mensaje:</b><br/> <blockquote style='margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex;'>" + msj + "</blockquote> <br/> ",
            }).then(function (message) {
                precarga('0');
                //alert("mail sent successfully");
                toast('OK', 'El mensaje ha sido enviado correctamente', 'success');
            });
            precarga('0');
        }
    });
});


/*FUNCIONES PERSONALIZADAS*/

function precarga(valor) {
    if (valor === '0') {
        NProgress.done();
    }
    if (valor === '1') {
        NProgress.configure({minimum: 0.1});
        NProgress.start();
        NProgress.set(0.4);
        NProgress.inc();
    }

}

function toast(title, msj, type) {
    switch (type) {
        case 'error':
            return iziToast.error({
                title: title,
                message: msj,
                position: 'topCenter' // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
            });
            break;

        case 'success':
            return iziToast.success({
                title: title,
                message: msj,
                position: 'topCenter' // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
            });
            break;
    }
}

function getMsg(selector) {
    return $(selector).attr('data-msg');
}
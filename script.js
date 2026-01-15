$(document).ready(function () {

    const saldoInicial = 60000;
    let saldo = localStorage.getItem('wallet_saldo');

    if (saldo === null) {
        saldo = saldoInicial;
        localStorage.setItem('wallet_saldo', saldo);
    } else {
        saldo = parseInt(saldo);
    }

    actualizarSaldoUI();

    let movimientos = JSON.parse(localStorage.getItem('wallet_movimientos')) || [
        { descripcion: "Curso online belleza", monto: -50000 },
        { descripcion: "Compra de libros académicos", monto: -18900 },
        { descripcion: "Pago matrícula instituto", monto: -75000 },
        { descripcion: "Material de estudio", monto: -12450 },
        { descripcion: "Suscripción plataforma educativa", monto: -10500 },
        { descripcion: "Taller de formación profesional", monto: -7575 }
    ];

    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        if (email && password) {
            window.location.href = 'menu.html';
        } else {
            alert('Por favor ingresa tus credenciales');
        }
    });

    $('#deposit-form').on('submit', function (e) {
        e.preventDefault();
        const monto = parseInt($('#deposit-amount').val());

        if (monto > 0) {
            saldo += monto;
            localStorage.setItem('wallet_saldo', saldo);

            agregarMovimiento("Depósito de fondos", monto);

            alert('Depósito realizado con éxito. Nuevo saldo: $' + saldo.toLocaleString('es-CL'));
            window.location.href = 'menu.html';
        } else {
            alert('Ingresa un monto válido.');
        }
    });

    $('#contact-list li').click(function () {
        $('#contact-list li').removeClass('active-contact');
        $(this).addClass('active-contact');
        $(this).css('background-color', '#f8bbd0');
        const contactName = $(this).find('strong').text();
        $('#selected-contact').val(contactName);
    });

    $('#send-money-form').on('submit', function (e) {
        e.preventDefault();
        const monto = parseInt($('#amount').val());
        const contacto = $('#selected-contact').val();

        if (!contacto) {
            alert('Por favor selecciona un contacto de la lista o busca uno.');
            return;
        }

        if (monto > 0 && monto <= saldo) {
            saldo -= monto;
            localStorage.setItem('wallet_saldo', saldo);

            agregarMovimiento("Transferencia a " + contacto, -monto);

            alert('Transferencia realizada con éxito a ' + contacto);
            window.location.href = 'menu.html';
        } else if (monto > saldo) {
            alert('Saldo insuficiente.');
        } else {
            alert('Ingresa un monto válido.');
        }
    });

    if ($('#transaction-list').length) {
        const lista = $('#transaction-list');
        lista.empty();

        movimientos.forEach(mov => {
            const colorClass = mov.monto > 0 ? 'text-success' : 'text-danger';
            const signo = mov.monto > 0 ? '+' : '';
            const html = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${mov.descripcion}
                    <span class="fw-bold ${colorClass}">${signo}$${Math.abs(mov.monto).toLocaleString('es-CL')}</span>
                </li>
            `;
            lista.append(html);
        });
    }

    function actualizarSaldoUI() {
        if ($('#user-balance').length) {
            $('#user-balance').text('$' + saldo.toLocaleString('es-CL'));
        }
        if ($('#user-balance-header').length) {
            $('#user-balance-header').text('$' + saldo.toLocaleString('es-CL'));
        }
    }

    function agregarMovimiento(descripcion, monto) {
        movimientos.unshift({ descripcion: descripcion, monto: monto });
        localStorage.setItem('wallet_movimientos', JSON.stringify(movimientos));
    }

    $('#search-contact').on('keyup', function () {
        var valor = $(this).val().toLowerCase();
        $("#contact-list li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(valor) > -1)
        });
    });

});

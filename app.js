// 1. Configuración de SUPABASE
const supabase_url = 'https://lcvvqsakkibulfxpyrxe.supabase.co';
const supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdnZxc2Fra2lidWxmeHB5cnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDE3ODUsImV4cCI6MjA5MTQ3Nzc4NX0.THPiVSpaRsiIS338w4JrUDzfbqyhBbHWzaPH4fBrtn8';
const supabaseClient = supabase.createClient(supabase_url, supabase_key);
const whatsapp_number = "573158643093"; 

console.log("¡Archivo cargado y listo!");

//Variables de estado
let serviciosData = [];
const container = document.getElementById('servicios-container');
const buscador = document.getElementById('buscador');

// 2. Obtener datos de Supabase
async function getServicios() {
    console.log("Consultando tabla Servicios...")
    try {
        const {data, error} = await supabaseClient
        .from('Servicios') //Verifica que sea idéntico al nombre en Supabase
        .select('*')
        .order('Código', {ascending: true}); //Ordenar por código de forma ascendente
        if(error) throw error;

        if(data && data.length > 0) {

        console.log("Datos recibidos:", data);
        serviciosData = data; // Guardar los datos en la variable de estado

        filtrarPorCategoria('Individual');

    //    renderCards(data); // LLama a la función que crea las tarjetas
    //    console.log("¡Datos enviados a renderizar!");
    }

    } catch (error) {
        console.error('Error al conectar:', error.message);
        container.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;   
        }
}

function generarLinkWhatsapp(item) {
    const costoVendedor = Number(item['Costo Vendedor']).toLocaleString();

    const e1 = '\u{1F4F1}'; // 📱
    const e2 = '\u{2705}'; // ✅
    const e3 = '\u{1F4B5}'; // 💵
    const e4 = '\u{26A0}'; // ⚠
    const e5 = '\u{1F44D}'; // 👍

    const msg = 
    ' *Pedido de Servicio Streaming*\n\n' +
    ' *Servicio:* ' + item['Servicio'] + '\n' +
    ' *Tu Costo:* $' + costoVendedor + '\n\n' +
    ' *Por favor, confirma adjuntando el comprobante de pago.*\n' +
    ' *¡Gracias por tu pedido!*';

    return 'https://wa.me/' + whatsapp_number + '?text=' + encodeURIComponent(msg);
}

//3. Renderizar las tarjetas en HTML 
function renderCards(lista) {
    container.innerHTML = '';

    // Definimos los colores neón para cada categoría
    const colores = {
        'Individual': '#00d2ff', // Cian
        'Dúos': '#9139f5', // Morado
        'Tríos': '#ff007a', // Rosa
        'Combos Especiales': '#ffd700' // Dorado
    };

    console.log("Dibujando " + lista.length + " tarjetas...");

    lista.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        const waLink = generarLinkWhatsapp(item);

        // Usamos ${colores[item['Categoría']]} para que el navegador busque el color en el objeto de arriba

        //Estructura con espacio para miniatura de canva
        card.innerHTML = `<div class="card-img-container">
        <img src="${item.Imagen_URL || 'img/placeholder.png'}" alt="${item.Servicio}" class="card-img">
        </div>

        <div class="card-header">
            <span class="badge" style="background-color: ${colores[item['Categoría']] || '#555'}">
                ${item['Categoría'] || 'General'}
            </span>
            <small style="color:gray">#${item['Código']}</small>
        </div>

        <h3 style="margin:0">${item['Servicio']}</h3> 

        <div class="costo-box">
            <div class="price-row">
                <span>Precio Cliente:</span>
                <span style="color: ${colores[item['Categoría']] || '#fff'}; font-weight: bold;">$
                    ${Number(item['Precio Cliente']).toLocaleString()}</span>
                </div>
                <div class="price-row">
                    <span>Tu Costo:</span>
                    <span>$
                        ${Number(item['Costo Vendedor']).toLocaleString()}</span>
                        </div>
                        
                        
                        <div class="ganancia">
                            <small style="font-weight:normal">Ganas: </small>
                            +$${Number(item['Comisión']).toLocaleString()}
                            </div>

                        <button
                            class="btn-whatsapp" id="wa-${item['Código']}">
                           
                            <svg viewBox="0 0 24 24" fill="white" widthe="16" height="16">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Comprar por WhatsApp
                        </button>
                    </div>
                `;
                            
                            container.appendChild(card);

                            // Agregar evento al botón de WhatsApp
                            document.getElementById('wa-' + item['Código']).addEventListener('click', function() {
                                window.open(generarLinkWhatsapp(item), '_blank');
                            })
    });
    
    console.log("¡Proceso de renderizado!");
    }

// Esta función se activa cuando haces clic en cualquier botón del menú
function filtrarPorCategoria(categoria) {
    console.log("Filtrando por:", categoria);

    // 1. Filtramos el array serviciosData que ya tiene la info de Supabase
    const filtrados = serviciosData.filter(item => {
        return item['Categoría'] === categoria;
    });

    // 2. Si la categoría existe, redibujamos las tarjetas con el filtro
    if (filtrados.length > 0) {
        renderCards(filtrados);
    }
}

//4. Lógica del Buscador (Filtro en tiempo real)
buscador.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtrados = serviciosData.filter(s => s.Servicio.toLowerCase().includes(query) || s.Categoría.toLowerCase().includes(query)
    );
    renderCards(filtrados);
});

//Nueva función para manejar el inicio de sesión
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    //Intentar iniciar sesión con Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Acceso denegado: " + error.message);
    } else {
        console.log("Sesión iniciada con éxito");

        //Ocultar el formulario de login y mostrar el contenido principal
        document.getElementById('auth-container').style.display = 'none';

        //Mostrar el buscador y el contenedor de servicios
        document.getElementById('main-content').style.display = 'block';

        //Ahora sí, cargar los servicios
        getServicios();
    }
}

// Iniciar carga
//getServicios();
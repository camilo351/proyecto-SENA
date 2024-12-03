import './registrarse.css'





function Registrarse(){
    return(
        <section class="registrarse">
        <form class="registrarse__form">
            <h2 class="registrarse__title">CONTACTO</h2>
            <div class="registrarse__input-container">
                <label> Nombre
                    <input class="registrarse__input" type="text" required placeholder="Nombre"/>
                </label>
            </div>

            <div class="registrarse__input-container">
                <label> Apellido
                    <input class="registrarse__input" type="text" required placeholder="Apellido"/>
                </label>
            </div>

            <div class="registrarse__input-container">
                <label> Teléfono
                    <input class="registrarse__input" type="tel" required placeholder="3000000000"/>
                </label>
            </div>

            <div class="registrarse__input-container">
                <label> Email
                    <input class="registrarse__input" type="email" required placeholder="email.com"/>
                </label>
            </div>

            <div class="registrarse__input-container">
                <label> Mensaje
                    <textarea  class="registrarse__input" required placeholder="Escribe aquí tu mensaje"></textarea>
                </label>
            </div>

            <div class="button-container">
                <button class="btn btn-1">ENVIAR</button>
            </div>
        </form>
    </section>
    );
}
export default Registrarse
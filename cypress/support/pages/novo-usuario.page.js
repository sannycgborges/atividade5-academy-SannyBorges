export default class NovoUsuarioPage {
    inputName = "#name";
    inputEmail = "#email";

    linkVoltar = '[href="/users"]'

    buttonClear = '[data-test-id="clearButton"]';
    buttonSubmit = 'button[type="submit"]';
    listaUsuarios = '#lista-usuarios';

    setUsername(username) {
        cy.get(this.inputName).type(username);
    }

    getUsername() {
        return cy.get(this.inputName);
    }

    setEmail(email) {
        cy.get(this.inputEmail).type(email);
    }

    getError() {
        return cy.get('span[class="sc-cPiKLX feFrSQ"]').invoke('text').as('textFunction');

    }

    getListaUsuarios() {
        return cy.get(this.listaUsuarios);
    }

    clickButtonSubmit() {
        cy.get(this.buttonSubmit).click();
    }
}
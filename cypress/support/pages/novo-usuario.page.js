export default class NovoUsuarioPage {
    inputName = 'input[name="name"]';
    inputEmail = 'input[type="email"]';

    buttonBack = '[href="/users"]'

    buttonSubmit = 'button[type="submit"]';

    setInputName(value) {
        cy.get(this.inputName).type(value);
    }

    setInputEmail(value) {
        cy.get(this.inputEmail).type(value);
    }

    clickButtonSubmit() {
        cy.get(this.buttonSubmit).click();
    }

    clickButtonBack() {
        cy.get(this.buttonBack).click();
    }
}
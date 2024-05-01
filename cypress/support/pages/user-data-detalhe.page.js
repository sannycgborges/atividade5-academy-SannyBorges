export default class UserDataDetalhePage {

    buttonUserDetail = 'a[id="userDataDetalhe"]';
    buttonEdit = 'button[type="button"]';
    buttonSubmit = 'button[type="submit"]';

    inputEmail = 'input[id="userEmail"]';

    clickButtonUserDetail() {
        cy.get(this.buttonUserDetail).click();
    }

    findLabelButtonEdit() {
        cy.get(this.buttonEdit).invoke('text').as('textFunction');
    }

    clickButtonEdit() {
        cy.get(this.buttonEdit).click();
    }

    clickButtonSubmit() {
        cy.get(this.buttonSubmit).click();
    }

    getInputEmail() {
        return cy.get(this.inputEmail);
    }

    setInputEmail(email) {
        cy.get(this.inputEmail).type(email);
    }

    clearInputEmail() {
        cy.get(this.inputEmail).clear();
    }
}
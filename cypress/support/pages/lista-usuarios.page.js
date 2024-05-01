export default class ListaUsuariosPage {

    buttonUserDetail = "#userDataDetalhe";
    buttonNewUser = 'a[href="/users/novo"]';

    inputSearch = 'input[placeholder="E-mail ou nome"]'
    buttonBack = 'button[id="paginacaoVoltar"]';
    buttonNext = 'button[id="paginacaoProximo"]';
    labelNewUser = 'a[href="/users/novo"]';

    listaUsuarios = '#listaUsuarios';

    setSearch(data) {
        cy.get(this.inputSearch).type(data);
    }

    getListaUsuarios() {
        return cy.get(this.listaUsuarios);
    }

    clickButtonNewUser() {
        cy.get(this.buttonNewUser).click();
    }

    clickLabelCadastreNovoUsuario() {
        cy.get(this.labelNewUser).last().click();
    }

    clickUserDetail() {
        cy.get(this.buttonUserDetail).click();
    }
}
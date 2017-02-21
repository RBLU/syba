class NavbarController {

  /* @ngInject */
  constructor(UserService, $state) {
    this.name = 'navbar';
    this.isNavCollapsed = true;
    this.isCollapsed = false;
    this.isCollapsedHorizontal = false;

    this.user = UserService.principal.getUser();

    this.logout = () => {
      UserService.logout()
        .then(() => {
          $state.go('signin');
        });
    };

    this.hasAccess = UserService.principal.isAuthorized;
  }
}

export default NavbarController;

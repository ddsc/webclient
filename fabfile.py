from fabric.decorators import task

from sitesetup.fab.config import init_file
from sitesetup.fab import detail
from sitesetup.fab.tasks import staging, production

# Most settings can be configured in fabfile.cfg
init_file('fabfile.cfg')

@task
def init():
    detail.initial_create_srv_dir()
    detail.switch_and_buildout()
    detail.initial_nginx_symlinks()

@task
def update():
    detail.switch_and_buildout()
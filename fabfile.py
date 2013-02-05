from sitesetup.fab.config import init_file
from sitesetup.fab.config import instances
from sitesetup.fab.detail import create_individual_database
from sitesetup.fab.tasks import *

# Most settings can be configured in fabfile.cfg
init_file('fabfile.cfg')


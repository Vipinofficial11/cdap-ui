/*
 * Copyright © 2016 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import Cookies from 'universal-cookie';

const cookie = new Cookies();

export default function RedirectToLogin(data) {
  let { statusCode } = data;
  let { url } = data.resource || {};
  let namespaceAPIRegex = new RegExp(/\/v3\/namespaces$/g);
  if ((statusCode === 401 && namespaceAPIRegex.test(url)) || (statusCode === 401 && !url)) {
    fetch('/logout', {
      method: 'POST',
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        cookie.remove('CDAP_Auth_User', { path: '/' });  
        window.location.href = window.getAbsUIUrl({
          uiApp: 'login',
          redirectUrl: location.pathname,
          clientId: 'cdap',
        });
      }  
    });
  }
  return true;
}

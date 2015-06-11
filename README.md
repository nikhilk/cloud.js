cloud.js
========

Cloud backend powered by node.js and connect and socket.io, and convention
over configuration.

The general idea is to focus development on bite-sized chunks of code -
effectively functions organized by convention, and assembled into cloud
backends by the runtime framework.

NOTE:

This is very much a work in progress. In fact, this node module doesn't even
do much just yet. The idea is to make it simple to build backends for web and
mobile frontends with little snippets of script, and configuration.

This node module will exist at https://www.npmjs.com/package/cloud.js and is
installable using:

    npm install cloud.js

Using the module:

    require('cloud.js').run(__dirname, require);



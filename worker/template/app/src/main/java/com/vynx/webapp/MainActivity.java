package com.vynx.webapp;
import android.app.Activity;import android.os.Bundle;import android.webkit.*;import android.view.*;import org.json.JSONObject;import java.io.*;
public class MainActivity extends Activity {
 WebView web;
 @Override public void onCreate(Bundle b){super.onCreate(b);getWindow().setStatusBarColor(0xFF17669E);getWindow().setNavigationBarColor(0xFF123B59);web=new WebView(this);web.setLayoutParams(new ViewGroup.LayoutParams(-1,-1));setContentView(web);WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(true);s.setAllowContentAccess(true);web.setWebViewClient(new WebViewClient());String remote=readRemote();if(remote!=null){try{web.loadUrl(new JSONObject(remote).getString("url"));}catch(Exception e){web.loadData("URL website tidak valid.","text/plain","UTF-8");}}else web.loadUrl("file:///android_asset/site/index.html");}
 String readRemote(){try(InputStream in=getAssets().open("site/remote.json")){ByteArrayOutputStream o=new ByteArrayOutputStream();byte[] b=new byte[2048];int n;while((n=in.read(b))!=-1)o.write(b,0,n);return o.toString("UTF-8");}catch(Exception e){return null;}}
 @Override public void onBackPressed(){if(web!=null&&web.canGoBack())web.goBack();else super.onBackPressed();}
}

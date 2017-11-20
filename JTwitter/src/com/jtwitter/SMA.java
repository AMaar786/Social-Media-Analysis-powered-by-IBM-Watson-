package com.jtwitter;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.social.stream.SocialStream;

/**
 * Servlet implementation class SMA
 */
@WebServlet("/SMA")
public class SMA extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SMA() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		String clientname = request.getParameter("client");
		String column = request.getParameter("column");
		String filtered = request.getParameter("filtered");
		String query = request.getParameter("query");
		String responseJSON = null;
	
		if(filtered.equals("true")){
			try {
				responseJSON = SocialStream.getFilteredSocialResponse(query, column,clientname);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			response.getWriter().append(request.getParameter("callback")+"("+responseJSON+")");
		}
		else{
			try {
				responseJSON = SocialStream.getSocialResponse(clientname);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		response.getWriter().append(request.getParameter("callback")+"("+responseJSON+")");
		}
		}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
